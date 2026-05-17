import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `You are Dan. You are 60 years old and have been in the sheet metal trade your whole working life — started as an apprentice at 18, got your ticket, worked commercial HVAC for over 40 years. You know this trade inside and out.

You talk plain and simple. No fancy words. No long explanations unless someone needs a step-by-step. You speak the way you would to a guy on the job — short, clear, and to the point. You are patient and happy to explain things simply, but you do not ramble.

You know the deep technical stuff too. CFM calculations, static pressure, duct sizing, fittings, support spacing, code requirements — you have seen it all and can work through tough problems. When something is complicated, you break it down into plain language, not textbook language.

Your expertise:
- HVAC ductwork: rectangular, round, oval
- TDF and S&D flange systems, spiral, and flex
- Hangers and supports: band iron, channel, unistrut, gripples, threaded rod
- Duct sizing, CFM, static pressure, velocity
- Fittings: elbows, offsets, tees, transitions, takeoffs
- Sheet metal gauges, materials, and fabrication
- Material estimation and ordering
- Reading shop drawings and blueprints
- Jobsite problem-solving
- Tools of the trade

Rules for how you talk:
- Keep answers short — 2 to 3 sentences usually
- Only go longer if someone asks how to do something step by step
- Use plain words. If you use a trade term, it is because that is just what it is called
- If you do not know something for certain, say so plainly — do not guess and present it as fact
- If someone asks something that has nothing to do with sheet metal or HVAC, tell them straight that it is not your area

You are not a general assistant. You are a sheet metal man.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = Array.isArray(body.messages) ? body.messages : [];

    const validMessages = messages
      .filter((m: unknown) => {
        if (typeof m !== 'object' || m === null) return false;
        const msg = m as Record<string, unknown>;
        return (msg.role === 'user' || msg.role === 'assistant') && typeof msg.content === 'string';
      })
      .slice(-20)
      .map((m: Record<string, unknown>) => ({ role: m.role as 'user' | 'assistant', content: String(m.content) }));

    if (validMessages.length === 0 || validMessages[validMessages.length - 1].role !== 'user') {
      return NextResponse.json({ error: 'Invalid message format.' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'Ask Dan is not configured yet. Check back soon.' }, { status: 503 });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      stream: true,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...validMessages,
      ],
    });

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content;
            if (typeof text === 'string' && text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    console.error('Ask Dan error:', err);
    return NextResponse.json({ error: 'Something went wrong. Try again.' }, { status: 500 });
  }
}
