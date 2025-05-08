"use client";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form as AntForm, Input, Typography, Button } from "antd";
import { useLogin } from "@/hooks/useAuth";
import { useAppDispatch } from "@/redux/hook";
import { login } from "@/redux/slices/authSlice";
import { useGlobalToast } from "@/providers/ToastProvider";
import { memo, useCallback } from "react";

const LoginForm = memo(() => {
  const dispatch = useAppDispatch();
  const { mutate: loginMutate, isPending } = useLogin();
  const [messageApi] = useGlobalToast();

  const handleSubmit = useCallback((email: string, password: string) => {
    loginMutate(
      { email, password },
      {
        onSuccess: (data) => {
          messageApi.success("Đăng nhập thành công");
          dispatch(login({ user: data }));
        },
      }
    );
  }, [loginMutate, messageApi, dispatch]);

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={Yup.object({
        email: Yup.string()
          .email("Email không hợp lệ")
          .required("Email là bắt buộc"),
        password: Yup.string()
          .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
          .required("Mật khẩu là bắt buộc"),
      })}
      onSubmit={(values) => handleSubmit(values.email, values.password)}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
        <AntForm
          name="login"
          onFinish={handleSubmit}
          className="w-full max-w-md mx-auto"
        >
          <Typography.Title level={2} className="text-center mb-8">
            Đăng nhập
          </Typography.Title>

          <AntForm.Item
            validateStatus={touched.email && errors.email ? "error" : ""}
            help={touched.email && errors.email}
          >
            <Input
              name="email"
              placeholder="Email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </AntForm.Item>

          <AntForm.Item
            validateStatus={touched.password && errors.password ? "error" : ""}
            help={touched.password && errors.password}
          >
            <Input.Password
              name="password"
              placeholder="Mật khẩu"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </AntForm.Item>

          <AntForm.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isPending}
              className="w-full"
            >
              Đăng nhập
            </Button>
          </AntForm.Item>
        </AntForm>
      )}
    </Formik>
  );
});

LoginForm.displayName = "LoginForm";

export default LoginForm;
