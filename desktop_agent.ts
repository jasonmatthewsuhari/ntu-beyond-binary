import OpenAI from 'openai';
import { GUIAgent } from '@ui-tars/sdk';
import { NutJSOperator } from '@ui-tars/operator-nut-js';

// --- THE FINAL MONKEY PATCH --------------------------------------
const originalCreate = OpenAI.Chat.Completions.prototype.create;

// @ts-ignore
OpenAI.Chat.Completions.prototype.create = async function (body: any, options: any) {
    // 1. CLEAN INPUT (Request)
    if (body.thinking !== undefined) delete body.thinking;
    if (body.stop === null || body.stop === undefined || (Array.isArray(body.stop) && body.stop.length === 0)) {
        delete body.stop;
    }

    // 2. EXECUTE API CALL
    const response = await originalCreate.call(this, body, options);

    // 3. CLEAN OUTPUT (Response) - The critical fix for your error
    if (response.choices && response.choices[0]?.message?.content) {
        let content = response.choices[0].message.content;

        // REMOVE MARKDOWN BACKTICKS (The cause of your crash)
        content = content.replace(/```/g, '');

        // Remove "json" or "python" language tags if the AI added them
        content = content.replace(/^(json|python|bash)/im, '');

        // Standardize the "Action:" label
        content = content.replace(/##\s*Action:/gi, 'Action:');
        content = content.replace(/##\s*Thought:/gi, 'Thought:');

        // Remove newlines between "Action:" and the command
        content = content.replace(/Action:\s*[\r\n]+\s*/g, 'Action: ');

        // Trim any leftover whitespace
        response.choices[0].message.content = content.trim();

        console.log(`[Patch] Cleaned Response: "${response.choices[0].message.content.slice(-50)}..."`);
    }

    return response;
};
// ------------------------------------------------------------------

async function main() {
    console.log("Initializing Agent with Markdown Stripper...");

    const agent = new GUIAgent({
        model: {
            baseURL: 'https://api.openai.com/v1',
            apiKey: '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',
            model: 'gpt-4o',
        } as any,
        operator: new NutJSOperator(),
        onData: ({ data }) => {
            if ((data as any).screenshotBase64) {
                console.log('[GUIAgent] 📸 Vision processing...');
            } else {
                // Keep logs readable
                const log = JSON.stringify(data);
                if (log.length < 200) console.log('data:', log);
            }
        },
        onError: ({ error }) => console.error('ERROR:', error),
    });

    console.log("🚀 Agent Running. SWITCH WINDOWS NOW!");
    await new Promise(r => setTimeout(r, 3000));

    try {
        await agent.run(`
            Open chrome and go to youtube
        `);
    } catch (err) {
        console.error("Execution failed:", err);
    }
}

main();