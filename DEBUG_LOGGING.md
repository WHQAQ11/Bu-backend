# 调试日志系统使用指南

## 概述

本项目已集成详细的调试日志系统，帮助开发者监控和分析占卜系统的数据流，特别是后端与LLM的交互过程。

## 日志级别

支持以下日志级别：
- `DEBUG`: 详细的调试信息（默认关闭）
- `INFO`: 一般信息记录
- `WARN`: 警告信息
- `ERROR`: 错误信息

## 环境变量配置

### 启用详细调试日志

在Railway中设置以下环境变量：

```bash
# 启用调试日志（重要！）
DEBUG=true

# 设置日志级别（可选）
LOG_LEVEL=debug

# 设置环境为开发模式（可选）
NODE_ENV=development
```

### 配置说明

- `DEBUG=true`: 启用详细的调试信息，包括：
  - 完整的占卜请求和响应数据
  - 发送给AI的完整prompt
  - AI返回的完整解读内容
  - 卦象数据的详细信息
  - Token使用统计

- `LOG_LEVEL`: 控制日志详细程度
  - `debug`: 显示所有日志（推荐用于问题排查）
  - `info`: 显示一般信息和错误
  - `warn`: 只显示警告和错误
  - `error`: 只显示错误

## 日志内容示例

### 1. 占卜请求日志
```
🔍 [DEBUG] [占卜请求] 用户发起占卜
{
  "userId": 123,
  "method": "liuyao",
  "question": "投资是否有利？",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. 卦象数据日志
```
🔍 [DEBUG] [卦象数据] 使用卦象数据库
{
  "name": "师",
  "number": 7,
  "symbolism": "地中有水，师；君子以容民畜众",
  "elements": {
    "wuxing": "木",
    "season": "春",
    "direction": "东",
    "nature": "团队",
    "relationship": "领导、组织、纪律"
  },
  "analysisKeys": ["career", "relationship", "health", "wealth"]
}
```

### 3. AI交互日志
```
🔍 [DEBUG] [AI请求] 发送提示词到智谱AI
{
  "promptLength": 1500,
  "promptPreview": "作为专业占卜师，请解读师卦对问题"投资是否有利？"的启示...",
  "params": {
    "temperature": 0.7,
    "maxTokens": 2000,
    "model": "glm-4-flash"
  }
}

🔍 [DEBUG] [AI响应] 收到智谱AI回复
{
  "responseLength": 800,
  "responsePreview": "基于您的"投资是否有利？"问题，以及所得的师卦象，AI为您解读...",
  "usage": {
    "promptTokens": 350,
    "completionTokens": 450,
    "totalTokens": 800
  }
}
```

### 4. 提示词构造日志
```
🔍 [DEBUG] [提示词构造] 开始构造AI提示词
{
  "method": "liuyao",
  "question": "投资是否有利？",
  "guaName": "师",
  "guaNumber": 7,
  "options": {
    "style": "detailed",
    "focus": "wealth",
    "language": "chinese",
    "includeAdvice": true,
    "includeWarnings": true
  }
}
```

## Railway中查看日志

1. 进入Railway Dashboard
2. 点击你的后端服务
3. 选择"Logs"标签
4. 确保选择了"Production"环境
5. 实时查看日志输出

## 问题排查指南

### 1. AI解读相似问题
查看以下日志来定位问题：
- 卦象数据是否正确加载
- 不同卦象的symbolism和analysis字段是否有差异
- 发送给AI的prompt是否包含卦象特有信息
- AI是否收到了完整的卦象上下文

### 2. AI调用失败问题
查看这些日志：
- API密钥是否正确配置
- 请求格式是否符合智谱AI要求
- 响应状态码和错误信息
- Token使用情况

### 3. 性能问题
监控这些指标：
- API响应时间
- Token消耗量
- 数据库查询时间
- 提示词构造时间

## 安全注意事项

### 生产环境使用
- 敏感信息已自动脱敏处理
- 可以随时通过环境变量关闭详细日志
- 建议问题排查后及时关闭DEBUG模式

### 日志数据
- 不记录用户的API密钥
- 不记录完整的用户身份信息
- AI响应内容会被截断预览

## 自定义日志

如需添加自定义日志，使用以下方式：

```typescript
import { logger } from '../utils/logger';

// 记录调试信息
logger.debug('分类', '消息', data);

// 记录占卜相关
logger.divinationRequest(question, method, userId);
logger.divinationResult(result, userId);

// 记录AI交互
logger.aiRequest(prompt, params);
logger.aiResponse(response, usage);

// 记录API响应
logger.apiResponse(apiPath, response, duration);
```

## 故障排除

### 日志未显示
1. 检查环境变量 `DEBUG=true` 是否设置
2. 确认选择了正确的环境和日志级别
3. 验证应用是否成功重启

### 日志过多
1. 调整 `LOG_LEVEL` 为 `info` 或 `warn`
2. 临时关闭 `DEBUG=false`
3. 使用更具体的日志分类

通过这个调试日志系统，你可以清晰地看到占卜系统的每一个数据交互环节，快速定位问题并优化系统性能。