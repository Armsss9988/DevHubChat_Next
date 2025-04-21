"use client";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form as AntForm, Input, Typography, Button } from "antd";
import { useLogin } from "@/hooks/useAuth";
import { useAppDispatch } from "@/redux/hook";
import { login } from "@/redux/slices/authSlice";

import { useGlobalToast } from "@/providers/ToastProvider";
const LoginForm = () => {
  const dispatch = useAppDispatch();
  const { mutate: loginMutate, isPending } = useLogin();
  const [messageApi] = useGlobalToast();
  const handleSubmit = (email: string, password: string) => {
    loginMutate(
      { email, password },
      {
        onSuccess: (data) => {
          // api["success"]({
          //   message: "Đăng nhập thành công",
          //   description: "Xem danh sách phòng nào",
          // });
          messageApi.success("Đăng nhập thành công");
          dispatch(login({ user: data }));
        },
      }
    );
  };

  return (
    <div>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Email không hợp lệ")
            .required("Bắt buộc nhập email"),
          password: Yup.string()
            .min(6, "Mật khẩu tối thiểu 6 ký tự")
            .required("Bắt buộc nhập mật khẩu"),
        })}
        onSubmit={({ email, password }) => handleSubmit(email, password)}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          errors,
          touched,
        }) => (
          <AntForm
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-6 w-[300px] md:w-[400px]"
          >
            <AntForm.Item
              label={<Typography.Text strong>Email</Typography.Text>}
              validateStatus={touched.email && errors.email ? "error" : ""}
              help={touched.email && errors.email}
            >
              <Input
                name="email"
                placeholder="Enter your email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </AntForm.Item>

            <AntForm.Item
              label={<Typography.Text strong>Password</Typography.Text>}
              validateStatus={
                touched.password && errors.password ? "error" : ""
              }
              help={touched.password && errors.password}
            >
              <Input.Password
                name="password"
                placeholder="Enter your password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </AntForm.Item>

            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={isPending}
            >
              Login
            </Button>
          </AntForm>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
