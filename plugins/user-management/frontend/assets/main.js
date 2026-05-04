function j() {
  const e = window.React, I = window.antd, r = window.__ANT_DESIGN_ICONS__ || {}, { useState: i, useEffect: v, Fragment: g } = e, { Table: b, Button: u, Modal: x, Form: s, Input: y, Select: c, message: a } = I;
  function S() {
    const [_, d] = i([]), [C, h] = i(!1), [F, m] = i(!1), [o, f] = i(null), [l] = s.useForm(), T = async () => {
      h(!0);
      try {
        const n = await (await fetch("/api/plugins/user-management/users")).json();
        d(n.users || []);
      } catch (t) {
        a.error("加载用户列表失败"), console.error("加载用户列表失败:", t);
      } finally {
        h(!1);
      }
    };
    v(() => {
      T();
    }, []);
    const D = () => {
      f(null), m(!0), l.resetFields();
    }, U = (t) => {
      f(t), m(!0), l.setFieldsValue(t);
    }, N = async (t) => {
      try {
        await fetch(`/api/plugins/user-management/users/${t}`, {
          method: "DELETE"
        }), d((n) => n.filter((w) => w.id !== t)), a.success("删除成功");
      } catch (n) {
        a.error("删除失败"), console.error("删除失败:", n);
      }
    }, M = async () => {
      try {
        const t = await l.validateFields(), n = o ? `/api/plugins/user-management/users/${o.id}` : "/api/plugins/user-management/users", k = await fetch(n, {
          method: o ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(t)
        });
        if (k.ok) {
          const E = await k.json();
          o ? (d((p) => p.map((O) => O.id === E.id ? E : O)), a.success("更新成功")) : (d((p) => [...p, E]), a.success("创建成功")), m(!1), l.resetFields();
        } else
          a.error("提交失败");
      } catch (t) {
        a.error("提交失败"), console.error("提交失败:", t);
      }
    }, P = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: 80
      },
      {
        title: "姓名",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "邮箱",
        dataIndex: "email",
        key: "email"
      },
      {
        title: "角色",
        dataIndex: "role",
        key: "role"
      },
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
        render: (t, n) => e.createElement(
          g,
          null,
          e.createElement(u, {
            type: "link",
            icon: r.EditOutlined ? e.createElement(r.EditOutlined) : void 0,
            onClick: () => U(n)
          }, "编辑"),
          e.createElement(u, {
            type: "link",
            danger: !0,
            icon: r.DeleteOutlined ? e.createElement(r.DeleteOutlined) : void 0,
            onClick: () => N(n.id)
          }, "删除")
        )
      }
    ];
    return e.createElement(
      g,
      null,
      e.createElement(
        "div",
        { style: { marginBottom: 16, textAlign: "right" } },
        e.createElement(u, {
          type: "primary",
          icon: r.PlusOutlined ? e.createElement(r.PlusOutlined) : void 0,
          onClick: D
        }, "新建用户")
      ),
      e.createElement(b, {
        columns: P,
        dataSource: _,
        rowKey: "id",
        loading: C,
        bordered: !0
      }),
      e.createElement(
        x,
        {
          title: o ? "编辑用户" : "新建用户",
          open: F,
          onOk: M,
          onCancel: () => {
            m(!1), l.resetFields();
          },
          okText: "确定",
          cancelText: "取消"
        },
        e.createElement(
          s,
          { form: l, layout: "vertical" },
          e.createElement(
            s.Item,
            {
              label: "姓名",
              name: "name",
              rules: [{ required: !0, message: "请输入姓名" }]
            },
            e.createElement(y, { placeholder: "请输入姓名" })
          ),
          e.createElement(
            s.Item,
            {
              label: "邮箱",
              name: "email",
              rules: [
                { required: !0, message: "请输入邮箱" },
                { type: "email", message: "请输入有效的邮箱地址" }
              ]
            },
            e.createElement(y, { placeholder: "请输入邮箱" })
          ),
          e.createElement(
            s.Item,
            {
              label: "角色",
              name: "role",
              rules: [{ required: !0, message: "请选择角色" }]
            },
            e.createElement(
              c,
              { placeholder: "请选择角色" },
              e.createElement(c.Option, { value: "管理员" }, "管理员"),
              e.createElement(c.Option, { value: "用户" }, "用户"),
              e.createElement(c.Option, { value: "访客" }, "访客")
            )
          )
        )
      )
    );
  }
  return S;
}
export {
  j as default
};
