function N(I, O, x) {
  const { useState: i, useEffect: E, Fragment: g, createElement: e } = I, { Table: F, Button: u, Modal: v, Form: r, Input: p, Select: o, message: n } = O, { PlusOutlined: C, EditOutlined: S, DeleteOutlined: T } = x;
  function U() {
    const [D, d] = i([]), [M, k] = i(!1), [j, c] = i(!1), [l, h] = i(null), [s] = r.useForm(), q = async () => {
      k(!0);
      try {
        const a = await (await fetch("/api/plugins/user-management/users")).json();
        d(a.users || []);
      } catch (t) {
        n.error("加载用户列表失败"), console.error("加载用户列表失败:", t);
      } finally {
        k(!1);
      }
    };
    E(() => {
      q();
    }, []);
    const L = () => {
      h(null), c(!0), s.resetFields();
    }, P = (t) => {
      h(t), c(!0), s.setFieldsValue(t);
    }, V = async (t) => {
      try {
        await fetch(`/api/plugins/user-management/users/${t}`, {
          method: "DELETE"
        }), d((a) => a.filter((f) => f.id !== t)), n.success("删除成功");
      } catch (a) {
        n.error("删除失败"), console.error("删除失败:", a);
      }
    }, _ = async () => {
      try {
        const t = await s.validateFields(), a = l ? `/api/plugins/user-management/users/${l.id}` : "/api/plugins/user-management/users", w = await fetch(a, {
          method: l ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(t)
        });
        if (w.ok) {
          const m = await w.json();
          l ? (d((y) => y.map((b) => b.id === m.id ? m : b)), n.success("更新成功")) : (d((y) => [...y, m]), n.success("创建成功")), c(!1), s.resetFields();
        } else
          n.error("提交失败");
      } catch (t) {
        n.error("提交失败"), console.error("提交失败:", t);
      }
    }, B = [
      { title: "ID", dataIndex: "id", key: "id", width: 80 },
      { title: "姓名", dataIndex: "name", key: "name" },
      { title: "邮箱", dataIndex: "email", key: "email" },
      { title: "角色", dataIndex: "role", key: "role" },
      {
        title: "创建时间",
        dataIndex: "created_at",
        key: "created_at",
        render: (t) => new Date(t).toLocaleString("zh-CN")
      },
      {
        title: "操作",
        key: "action",
        width: 180,
        render: (t, a) => e(
          g,
          null,
          e(u, { type: "link", icon: e(S), onClick: () => P(a), key: "edit" }, "编辑"),
          e(u, { type: "link", danger: !0, icon: e(T), onClick: () => V(a.id), key: "delete" }, "删除")
        )
      }
    ];
    return e(
      g,
      null,
      e(
        "div",
        { style: { marginBottom: 16, textAlign: "right" }, key: "header" },
        e(u, { type: "primary", icon: e(C), onClick: L }, "新建用户")
      ),
      e(F, { columns: B, dataSource: D, rowKey: "id", loading: M, bordered: !0, key: "table" }),
      e(
        v,
        {
          title: l ? "编辑用户" : "新建用户",
          open: j,
          onOk: _,
          onCancel: () => {
            c(!1), s.resetFields();
          },
          okText: "确定",
          cancelText: "取消",
          key: "modal"
        },
        e(
          r,
          { form: s, layout: "vertical" },
          e(
            r.Item,
            { label: "姓名", name: "name", rules: [{ required: !0, message: "请输入姓名" }], key: "name" },
            e(p, { placeholder: "请输入姓名" })
          ),
          e(
            r.Item,
            { label: "邮箱", name: "email", rules: [{ required: !0, message: "请输入邮箱" }, { type: "email", message: "请输入有效的邮箱地址" }], key: "email" },
            e(p, { placeholder: "请输入邮箱" })
          ),
          e(
            r.Item,
            { label: "角色", name: "role", rules: [{ required: !0, message: "请选择角色" }], key: "role" },
            e(
              o,
              { placeholder: "请选择角色" },
              e(o.Option, { value: "管理员", key: "admin" }, "管理员"),
              e(o.Option, { value: "用户", key: "user" }, "用户"),
              e(o.Option, { value: "访客", key: "guest" }, "访客")
            )
          )
        )
      )
    );
  }
  return U;
}
(window.plugins = window.plugins || {})["user-management"] = N;
