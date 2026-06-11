import Groq from 'groq-sdk';
import Session from '../models/session.model.js';
import { generateQnaPrompt, loadMorePrompt, learnMorePrompt } from '../utils/prompts.js';

const getClient = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

const createSession = async (req, res) => {
    const { role, topics, experience, description } = req.body;

    const message = await getClient().chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 3000,
        messages: [{ role: 'user', content: generateQnaPrompt({ role, topics, experience, description }) }]
    });

    let qna = [];
    try {
        const text = message.choices[0].message.content.replace(/```json|```/g, '').trim();
        qna = JSON.parse(text);
    } catch {
        return res.status(500).json({ message: 'Failed to parse AI response' });
    }

    const session = await Session.create({ user: req.user._id, role, topics, experience, description, qna });
    res.status(201).json(session);
};

const getSessions = async (req, res) => {
    const sessions = await Session.find({ user: req.user._id }).sort('-createdAt');
    res.json(sessions);
};

const getSession = async (req, res) => {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ message: 'Not found' });
    res.json(session);
}

const deleteSession = async (req, res) => {
    await Session.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Deleted' });
}

const pinOrNote = async (req, res) => {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ message: 'Not found' });
    const item = session.qna.id(req.params.qnaId);
    if (!item) return res.status(404).json({ message: 'Q not found' });
    if (req.body.note !== undefined) item.note = req.body.note;
    if (req.body.pinned !== undefined) item.pinned = req.body.pinned;
    await session.save();
    res.json(session);
}

const learnMore = async (req, res) => {
    const { topic, role } = req.body;

    const message = await getClient().chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [{ role: 'user', content: learnMorePrompt({ topic, role }) }]
    });

    res.json({ explanation: message.choices[0].message.content.trim() });
}

const loadMore = async (req, res) => {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ message: 'Not found' });

    const existingQuestions = session.qna.map((q, i) => `${i + 1}. ${q.question}`).join('\n');

    const message = await getClient().chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 3000,
        messages: [{ role: 'user', content: loadMorePrompt({ role: session.role, experience: session.experience, topics: session.topics, existingQuestions }) }]
    });

    let newQna = [];
    try {
        const text = message.choices[0].message.content.replace(/```json|```/g, '').trim();
        newQna = JSON.parse(text);
    } catch {
        return res.status(500).json({ message: 'Failed to parse AI response' });
    }

    session.qna.push(...newQna);
    await session.save();
    res.json(session);
}

export { createSession, getSessions, getSession, deleteSession, pinOrNote, learnMore, loadMore };
