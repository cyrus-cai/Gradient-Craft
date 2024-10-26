import { JWT, OAuth2Client } from 'google-auth-library';
import { NextRequest, NextResponse } from 'next/server';

// app/api/analytics/route.ts
import { google } from 'googleapis';

// 配置服务账号认证
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const propertyId = process.env.GA4_PROPERTY_ID; // 例如: "properties/123456789"

        // 获取认证客户端并指定类型
        const authClient = await auth.getClient() as OAuth2Client | JWT;

        // 构建 Analytics Data API 客户端
        const analyticsDataClient = google.analyticsdata({
            version: 'v1beta',
            auth: authClient,
        });

        // 发送请求到 GA4 API
        const response = await analyticsDataClient.properties.runReport({
            property: `properties/${propertyId}`,
            requestBody: {
                dateRanges: body.dateRanges,
                dimensions: body.dimensions,
                metrics: body.metrics,
                // 可以添加其他参数如 dimensionFilter, metricFilter, orderBys 等
            },
        });

        // 返回数据
        return NextResponse.json(response.data, {
            status: 200,
        });

    } catch (error: any) {
        console.error('GA4 API Error:', error);

        return NextResponse.json(
            {
                error: {
                    message: error.message || 'Internal Server Error',
                    code: error.code || 500,
                },
            },
            {
                status: error.code || 500,
            }
        );
    }
}