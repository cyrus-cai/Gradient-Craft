'use client'

import Script from 'next/script';
import { useEffect } from 'react';

export function AdScript() {
    useEffect(() => {
        const lastLoaded = localStorage.getItem('adScriptLastLoaded');
        const now = Date.now();

        // 如果在24小时内已经加载过，则不再加载
        if (lastLoaded && (now - parseInt(lastLoaded)) < 24 * 60 * 60 * 1000) {
            return;
        }

        // 更新最后加载时间
        localStorage.setItem('adScriptLastLoaded', now.toString());

        // 创建并加载脚本
        const script = document.createElement('script');
        script.src = 'https://vemtoutcheeg.com/400/8432530';
        try {
            (document.body || document.documentElement).appendChild(script);
        } catch (e) {
            console.error('Failed to load ad script:', e);
        }
    }, []); // 空依赖数组确保只运行一次

    return null; // 这个组件不需要渲染任何内容
}