const FEISHU_BOT_WEBHOOK = 'https://open.feishu.cn/open-apis/bot/v2/hook/5e24fb8a-c673-4936-ab82-5ef9922a5c8f';

export const sendTextToFeishuBot = (
    text: string,
) =>
    fetch(FEISHU_BOT_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            msg_type: 'text',
            content: { text }
        })
    }).then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
    });