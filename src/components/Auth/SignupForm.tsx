"use client";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form as AntForm, Input, Typography, Button } from "antd";
import { useSignup } from "@/hooks/useAuth";
import { useAppDispatch } from "@/redux/hook";
import { login } from "@/redux/slices/authSlice";
import { useGlobalToast } from "@/providers/ToastProvider";
import { memo, useCallback } from "react";

const SignupForm = memo(() => {
  const { mutate: signup, isPending } = useSignup();
  const [messageApi] = useGlobalToast();
  const dispatch = useAppDispatch();

  const handleSubmit = useCallback((email: string, password: string, name: string) => {
    signup(
      { email, password, name },
      {
        onSuccess: (data) => {
          messageApi.success("Đăng ký thành công");
          dispatch(login({ user: data.user }));
        },
      }
    );
  }, [signup, messageApi, dispatch]);

  return (
    <Formik
      initialValues={{ email: "", password: "", name: "" }}
      validationSchema={Yup.object({
        email: Yup.string()
          .email("Email không hợp lệ")
          .required("Email là bắt buộc"),
        password: Yup.string()
          .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
          .required("Mật khẩu là bắt buộc"),
        name: Yup.string()
          .min(2, "Tên phải có ít nhất 2 ký tự")
          .required("Tên là bắt buộc"),
      })}
      onSubmit={(values) => handleSubmit(values.email, values.password, values.name)}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
        <AntForm
          name="signup"
          onFinish={handleSubmit}
          className="w-full max-w-md mx-auto"
        >
          <Typography.Title level={2} className="text-center mb-8">
            Đăng ký
          </Typography.Title>

          <AntForm.Item
            validateStatus={touched.name && errors.name ? "error" : ""}
            help={touched.name && errors.name}
          >
            <Input
              name="name"
              placeholder="Tên"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </AntForm.Item>

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
              Đăng ký
            </Button>
          </AntForm.Item>
        </AntForm>
      )}
    </Formik>
  );
});

SignupForm.displayName = "SignupForm";

export default SignupForm;
