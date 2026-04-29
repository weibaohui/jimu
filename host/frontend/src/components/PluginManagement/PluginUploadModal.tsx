import { useState } from 'react'
import { Modal, Upload, Button, Form, Input, message, Space, Tabs } from 'antd'
import { UploadOutlined, FileTextOutlined, LinkOutlined } from '@ant-design/icons'
import type { UploadProps, UploadFile } from 'antd'
import type { PluginUploadRequest } from '../../types/plugin'
import { pluginApi } from '../../services/pluginApi'

interface PluginUploadModalProps {
  visible: boolean
  onCancel: () => void
  onSuccess: () => void
}

export function PluginUploadModal({ visible, onCancel, onSuccess }: PluginUploadModalProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<'file' | 'path' | 'data'>('file')
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const handleUpload = async (values: any) => {
    try {
      setLoading(true)

      const request: PluginUploadRequest = {
        [uploadMethod]: values[uploadMethod],
      }

      const response = await pluginApi.uploadPlugin(request)

      if (response.success) {
        message.success('插件上传成功')
        form.resetFields()
        setFileList([])
        onCancel()
        onSuccess()
      } else {
        message.error(response.message || '插件上传失败')
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '插件上传失败')
    } finally {
      setLoading(false)
    }
  }

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      // 只允许上传 .plugin 文件
      const isPlugin = file.name.endsWith('.plugin')
      if (!isPlugin) {
        message.error('只能上传 .plugin 文件')
        return Upload.LIST_IGNORE
      }
      setFileList([file])
      return false // 阻止自动上传
    },
    onRemove: () => {
      setFileList([])
    },
    fileList,
  }

  return (
    <Modal
      title="上传插件"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleUpload}>
        <Tabs
          activeKey={uploadMethod}
          onChange={(key) => setUploadMethod(key as any)}
          items={[
            {
              key: 'file',
              label: (
                <span>
                  <UploadOutlined />
                  文件上传
                </span>
              ),
              children: (
                <Form.Item
                  name="file"
                  label="选择插件文件"
                  rules={[{ required: true, message: '请选择插件文件' }]}
                >
                  <Upload {...uploadProps}>
                    <Button icon={<UploadOutlined />}>选择文件</Button>
                  </Upload>
                </Form.Item>
              ),
            },
            {
              key: 'path',
              label: (
                <span>
                  <LinkOutlined />
                  服务器路径
                </span>
              ),
              children: (
                <Form.Item
                  name="path"
                  label="插件文件路径"
                  rules={[{ required: true, message: '请输入插件文件路径' }]}
                >
                  <Input
                    placeholder="/path/to/plugin.plugin"
                    prefix={<LinkOutlined />}
                  />
                </Form.Item>
              ),
            },
            {
              key: 'data',
              label: (
                <span>
                  <FileTextOutlined />
                  Base64 数据
                </span>
              ),
              children: (
                <Form.Item
                  name="data"
                  label="Base64 编码的插件数据"
                  rules={[{ required: true, message: '请输入Base64编码的插件数据' }]}
                >
                  <Input.TextArea
                    rows={8}
                    placeholder="粘贴Base64编码的.plugin文件内容"
                  />
                </Form.Item>
              ),
            },
          ]}
        />

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              上传
            </Button>
            <Button onClick={onCancel}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}
