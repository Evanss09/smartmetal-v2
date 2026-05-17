import { NextRequest, NextResponse } from 'next/server';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

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

    const ollamaRes = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: true,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...validMessages,
        ],
      }),
    });

    if (!ollamaRes.ok || !ollamaRes.body) {
      console.error('Ollama error:', ollamaRes.status, await ollamaRes.text().catch(() => ''));
      return NextResponse.json({ error: 'Ollama unavailable. Make sure it is running.' }, { status: 502 });
    }

    const readable = new ReadableStream({
      async start(controller) {
        const reader = ollamaRes.body!.getReader();
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        let buf = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buf += decoder.decode(value, { stream: true });
            const lines = buf.split('\n');
            buf = lines.pop() ?? '';
            for (const line of lines) {
              if (!line.trim()) continue;
              try {
                const json = JSON.parse(line);
                const text = json?.message?.content;
                if (typeof text === 'string' && text) {
                  controller.enqueue(encoder.encode(text));
                }
              } catch {
                // skip malformed lines
              }
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
