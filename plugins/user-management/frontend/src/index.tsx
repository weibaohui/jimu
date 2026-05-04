// 导出工厂函数，确保在调用时 React 上下文已正确初始化
export default function createUserManagement() {
  const React = (window as any).React
  const antd = (window as any).antd
  const icons = (window as any).__ANT_DESIGN_ICONS__ || {}

  const { useState, useEffect, Fragment } = React
  const { Table, Button, Modal, Form, Input, Select, message } = antd

  function UserManagement() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [form] = Form.useForm()

    const loadUsers = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/plugins/user-management/users')
        const data = await response.json()
        setUsers(data.users || [])
      } catch (error) {
        message.error('加载用户列表失败')
        console.error('加载用户列表失败:', error)
      } finally {
        setLoading(false)
      }
    }

    useEffect(() => {
      loadUsers()
    }, [])

    const handleCreate = () => {
      setEditingUser(null)
      setModalVisible(true)
      form.resetFields()
    }

    const handleEdit = (user) => {
      setEditingUser(user)
      setModalVisible(true)
      form.setFieldsValue(user)
    }

    const handleDelete = async (id) => {
      try {
        await fetch(`/api/plugins/user-management/users/${id}`, {
          method: 'DELETE',
        })
        setUsers(prev => prev.filter(u => u.id !== id))
        message.success('删除成功')
      } catch (error) {
        message.error('删除失败')
        console.error('删除失败:', error)
      }
    }

    const handleSubmit = async () => {
      try {
        const values = await form.validateFields()
        const url = editingUser
          ? `/api/plugins/user-management/users/${editingUser.id}`
          : '/api/plugins/user-management/users'
        const method = editingUser ? 'PUT' : 'POST'

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })

        if (response.ok) {
          const data = await response.json()
          if (editingUser) {
            setUsers(prev => prev.map(u => (u.id === data.id ? data : u)))
            message.success('更新成功')
          } else {
            setUsers(prev => [...prev, data])
            message.success('创建成功')
          }

          setModalVisible(false)
          form.resetFields()
        } else {
          message.error('提交失败')
        }
      } catch (error) {
        message.error('提交失败')
        console.error('提交失败:', error)
      }
    }

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '角色',
        dataIndex: 'role',
        key: 'role',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (date) => new Date(date).toLocaleString('zh-CN'),
      },
      {
        title: '操作',
        key: 'action',
        width: 180,
        render: (_, record) => (
          React.createElement(Fragment, null,
            React.createElement(Button, {
              type: 'link',
              icon: icons.EditOutlined ? React.createElement(icons.EditOutlined) : undefined,
              onClick: () => handleEdit(record),
            }, '编辑'),
            React.createElement(Button, {
              type: 'link',
              danger: true,
              icon: icons.DeleteOutlined ? React.createElement(icons.DeleteOutlined) : undefined,
              onClick: () => handleDelete(record.id),
            }, '删除')
          )
        ),
      },
    ]

    return React.createElement(Fragment, null,
      React.createElement('div', { style: { marginBottom: 16, textAlign: 'right' } },
        React.createElement(Button, {
          type: 'primary',
          icon: icons.PlusOutlined ? React.createElement(icons.PlusOutlined) : undefined,
          onClick: handleCreate,
        }, '新建用户')
      ),
      React.createElement(Table, {
        columns,
        dataSource: users,
        rowKey: 'id',
        loading,
        bordered: true,
      }),
      React.createElement(Modal, {
        title: editingUser ? '编辑用户' : '新建用户',
        open: modalVisible,
        onOk: handleSubmit,
        onCancel: () => {
          setModalVisible(false)
          form.resetFields()
        },
        okText: '确定',
        cancelText: '取消',
      },
        React.createElement(Form, { form, layout: 'vertical' },
          React.createElement(Form.Item, {
            label: '姓名',
            name: 'name',
            rules: [{ required: true, message: '请输入姓名' }],
          },
            React.createElement(Input, { placeholder: '请输入姓名' })
          ),
          React.createElement(Form.Item, {
            label: '邮箱',
            name: 'email',
            rules: [
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ],
          },
            React.createElement(Input, { placeholder: '请输入邮箱' })
          ),
          React.createElement(Form.Item, {
            label: '角色',
            name: 'role',
            rules: [{ required: true, message: '请选择角色' }],
          },
            React.createElement(Select, { placeholder: '请选择角色' },
              React.createElement(Select.Option, { value: '管理员' }, '管理员'),
              React.createElement(Select.Option, { value: '用户' }, '用户'),
              React.createElement(Select.Option, { value: '访客' }, '访客')
            )
          )
        )
      )
    )
  }

  return UserManagement
}
