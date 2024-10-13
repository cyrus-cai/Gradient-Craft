'use client'

import { useEffect, useState } from 'react';

import Centre from './Centre';
import dynamic from 'next/dynamic';

// 直接导入桌面版组件

const CentreMobile = dynamic(() => import('./CentreMobile'), {
    ssr: false,
    loading: () => <Centre />  // 使用桌面版作为加载占位符
});

const App = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
        };

        // 初始检查
        checkMobile();

        // 添加 resize 事件监听器
        window.addEventListener('resize', checkMobile);

        // 清理函数
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 在客户端渲染之前，返回 null 或加载占位符
    if (!hasMounted) {
        return null; // 或者返回一个加载指示器
    }

    // 根据 isMobile 状态选择要渲染的组件
    return (
        <div>
            {isMobile ? <CentreMobile /> : <Centre />}
        </div>
    );
};

export default App;