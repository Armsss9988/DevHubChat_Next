"use client";
import { Modal, Input, Button, Form } from "antd";
import { useState } from "react";

interface RoomModalProps {
  open: boolean;
  onCancel: () => void;
  onCreate: (name: string, description: string) => void;
  loading: boolean;
}

const RoomModal: React.FC<RoomModalProps> = ({
  open,
  onCancel,
  onCreate,
  loading,
}) => {
  const [name, setRoomName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate(name, description);
    setRoomName("");
    setDescription("");
  };

  return (
    <Modal
      open={open}
      title={<span className="text-[#395144]">Create New Room</span>}
      onCancel={onCancel}
      footer={null}
      centered
      className="custom-modal"
    >
      <Form layout="vertical" className="space-y-2">
        <Form.Item
          label={<span className="text-[#4E6C50]">Room Name</span>}
          required
        >
          <Input
            placeholder="Enter room name"
            value={name}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </Form.Item>
        <Form.Item label={<span className="text-[#4E6C50]">Description</span>}>
          <Input.TextArea
            placeholder="Enter room description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </Form.Item>
        <div className="flex justify-end space-x-2">
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            type="primary"
            onClick={handleCreate}
            loading={loading}
            className="bg-[#395144] hover:bg-[#4E6C50] border-none text-white"
          >
            Create Room
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default RoomModal;
