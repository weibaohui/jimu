function createUserManagement(React: any, antd: any, icons: any) {
  const { useState, useEffect, Fragment, createElement } = React
  const { Table, Button, Modal, Form, Input, Select, message } = antd
  const { PlusOutlined, EditOutlined, DeleteOutlined } = icons

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

    const handleEdit = (user: any) => {
      setEditingUser(user)
      setModalVisible(true)
      form.setFieldsValue(user)
    }

    const handleDelete = async (id: string) => {
      try {
        await fetch(`/api/plugins/user-management/users/${id}`, {
          method: 'DELETE',
        })
        setUsers((prev: any[]) => prev.filter((u: any) => u.id !== id))
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
            setUsers((prev: any[]) => prev.map((u: any) => (u.id === data.id ? data : u)))
            message.success('更新成功')
          } else {
            setUsers((prev: any[]) => [...prev, data])
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
      { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
      { title: '姓名', dataIndex: 'name', key: 'name' },
      { title: '邮箱', dataIndex: 'email', key: 'email' },
      { title: '角色', dataIndex: 'role', key: 'role' },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (date: string) => new Date(date).toLocaleString('zh-CN'),
      },
      {
        title: '操作',
        key: 'action',
        width: 180,
        render: (_: any, record: any) =>
          createElement(Fragment, null,
            createElement(Button, { type: 'link', icon: createElement(EditOutlined), onClick: () => handleEdit(record), key: 'edit' }, '编辑'),
            createElement(Button, { type: 'link', danger: true, icon: createElement(DeleteOutlined), onClick: () => handleDelete(record.id), key: 'delete' }, '删除')
          ),
      },
    ]

    return createElement(Fragment, null,
      createElement('div', { style: { marginBottom: 16, textAlign: 'right' }, key: 'header' },
        createElement(Button, { type: 'primary', icon: createElement(PlusOutlined), onClick: handleCreate }, '新建用户')
      ),
      createElement(Table, { columns, dataSource: users, rowKey: 'id', loading, bordered: true, key: 'table' }),
      createElement(Modal, {
        title: editingUser ? '编辑用户' : '新建用户',
        open: modalVisible,
        onOk: handleSubmit,
        onCancel: () => {
          setModalVisible(false)
          form.resetFields()
        },
        okText: '确定',
        cancelText: '取消',
        key: 'modal'
      },
        createElement(Form, { form, layout: 'vertical' },
          createElement(Form.Item, { label: '姓名', name: 'name', rules: [{ required: true, message: '请输入姓名' }], key: 'name' },
            createElement(Input, { placeholder: '请输入姓名' })
          ),
          createElement(Form.Item, { label: '邮箱', name: 'email', rules: [{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入有效的邮箱地址' }], key: 'email' },
            createElement(Input, { placeholder: '请输入邮箱' })
          ),
          createElement(Form.Item, { label: '角色', name: 'role', rules: [{ required: true, message: '请选择角色' }], key: 'role' },
            createElement(Select, { placeholder: '请选择角色' },
              createElement(Select.Option, { value: '管理员', key: 'admin' }, '管理员'),
              createElement(Select.Option, { value: '用户', key: 'user' }, '用户'),
              createElement(Select.Option, { value: '访客', key: 'guest' }, '访客')
            )
          )
        )
      )
    )
  }

  return UserManagement
}

// 挂载到 window
;((window as any).plugins = (window as any).plugins || {})['user-management'] = createUserManagement
