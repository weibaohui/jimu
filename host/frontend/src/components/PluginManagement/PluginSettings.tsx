import { Card, Form, InputNumber, Switch, Button, Space, Divider, Typography } from 'antd'

const { Title, Text } = Typography

export function PluginSettings() {
  const [form] = Form.useForm()

  const handleSave = (values: any) => {
    console.log('Saving settings:', values)
    // TODO: 调用API保存设置
  }

  return (
    <Card title="插件系统设置">
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          autoReload: true,
          memoryLimit: 1024,
          cpuLimit: 30,
          logRetentionDays: 7,
        }}
        onFinish={handleSave}
      >
        <Title level={4}>自动重载</Title>
        <Form.Item
          name="autoReload"
          label="启用自动重载"
          valuePropName="checked"
          extra="插件文件变更时自动重新加载"
        >
          <Switch />
        </Form.Item>

        <Divider />

        <Title level={4}>资源限制</Title>
        <Form.Item
          name="memoryLimit"
          label="内存限制 (MB)"
          extra="每个插件的最大内存使用量"
        >
          <InputNumber min={128} max={8192} step={128} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="cpuLimit"
          label="CPU 时间限制 (秒)"
          extra="每个操作的最大CPU时间"
        >
          <InputNumber min={5} max={300} step={5} style={{ width: '100%' }} />
        </Form.Item>

        <Divider />

        <Title level={4}>日志管理</Title>
        <Form.Item
          name="logRetentionDays"
          label="日志保留天数"
          extra="超过此天数的日志将被自动清理"
        >
          <InputNumber min={1} max={90} step={1} style={{ width: '100%' }} />
        </Form.Item>

        <Divider />

        <Space>
          <Button type="primary" htmlType="submit">
            保存设置
          </Button>
          <Button onClick={() => form.resetFields()}>
            重置
          </Button>
        </Space>
      </Form>

      <Divider />

      <Title level={4}>系统信息</Title>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Text>主机版本: 1.0.0</Text>
        <Text>接口版本: 1.0.0</Text>
        <Text>运行环境: {navigator.userAgent}</Text>
      </Space>
    </Card>
  )
}
