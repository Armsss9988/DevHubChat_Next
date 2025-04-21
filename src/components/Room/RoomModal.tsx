"use client";
import { useAppSelector } from "@/redux/hook";
import { Modal, Input, Button, Form } from "antd";
import { useEffect } from "react";

export interface RoomData {
  id?: string;
  name: string;
  description: string;
  password?: string;
  creatorId: string;
}

interface RoomModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: RoomData) => void;
  loading: boolean;
  room?: RoomData;
}

const RoomModal: React.FC<RoomModalProps> = ({
  open,
  onCancel,
  onSubmit,
  loading,
  room,
}) => {
  const [form] = Form.useForm();
  const user = useAppSelector((state) => state.auth.user);
  useEffect(() => {
    if (room) {
      form.setFieldsValue({
        name: room.name,
        description: room.description,
        password: room.password,
        creatorId: room.creatorId,
      });
    }
  }, [room, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit({
        id: room?.id,
        name: values.name,
        description: values.description,
        password: values.password,
        creatorId: user?.id || "",
      });
    });
  };

  return (
    <Modal
      open={open}
      title={
        <span className="text-[#395144]">
          {room ? "Update Room" : "Create New Room"}
        </span>
      }
      onCancel={onCancel}
      footer={null}
      centered
      className="custom-modal"
    >
      <Form
        form={form}
        layout="vertical"
        className="space-y-2"
        initialValues={{
          name: "",
          description: "",
          roomCode: "",
          password: "",
        }}
      >
        <Form.Item
          label={<span className="text-[#4E6C50]">Room Name</span>}
          name="name"
          rules={[{ required: true, message: "Please enter room name" }]}
        >
          <Input placeholder="Enter room name" />
        </Form.Item>
        <Form.Item
          label={<span className="text-[#4E6C50]">Description</span>}
          name="description"
        >
          <Input.TextArea placeholder="Enter room description" rows={3} />
        </Form.Item>
        <Form.Item
          label={<span className="text-[#4E6C50]">Password (optional)</span>}
          name="password"
        >
          <Input.Password placeholder="Enter room password" />
        </Form.Item>
        <div className="flex justify-end space-x-2">
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            type="primary"
            htmlType="submit"
            onClick={handleSubmit}
            loading={loading}
            className="bg-[#395144] hover:bg-[#4E6C50] border-none text-white"
          >
            {room ? "Update Room" : "Create Room"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default RoomModal;
