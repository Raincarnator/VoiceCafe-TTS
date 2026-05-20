// XML 文本转义函数
export function escapeXmlText(text) {
    return text
        .replace(/&/g, '&amp;')   // 必须首先处理 &
        .replace(/</g, '&lt;')    // 处理 <
        .replace(/>/g, '&gt;')    // 处理 >
        .replace(/"/g, '&quot;')  // 处理 "
        .replace(/'/g, '&apos;'); // 处理 '
}

// 生成 SSML 格式的 XML
export function getSsml(text, voiceName, rate, pitch, volume, style, slien = 0) {
    const escapedText = escapeXmlText(text);

    let slien_str = '';
    if (slien > 0) {
        slien_str = `<break time="${slien}ms" />`;
    }

    return `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" version="1.0" xml:lang="zh-CN">
                <voice name="${voiceName}">
                    <mstts:express-as style="${style}"  styledegree="2.0" role="default" >
                        <prosody rate="${rate}" pitch="${pitch}" volume="${volume}">${escapedText}</prosody>
                    </mstts:express-as>
                    ${slien_str}
                </voice>
            </speak>`;
}
