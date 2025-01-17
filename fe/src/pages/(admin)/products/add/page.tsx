import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, InputNumber, message, Radio, Select, Switch, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

const ProductAdd = () => {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const { mutate, isPending } = useMutation({
        mutationFn: async (product) => {
            return await axios.post(`http://localhost:3000/products`, product);
        },
        onSuccess: () => {
            // reset form
            form.resetFields();
            messageApi.open({
                type: "success",
                content: "Thêm sản phẩm thành công!",
            });
            queryClient.invalidateQueries({
                queryKey: ["products"],
            });
        },
    });
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
    const onHandleChange = (info: any) => {
        if (info.file.status === "done") {
            setImageUrls((prev) => [...prev, info.file.response.secure_url]);
        }
    };
    const onFinish = (values: any) => {
        if (!imageUrls) return;
        console.log(1);
        mutate({ ...values, imageUrls });
    };
    return (
        <div>
            {contextHolder}
            <Form
                name="basic"
                form={form}
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: 600,
                }}
                onFinish={onFinish}
                disabled={isPending}
            >
                <Form.Item
                    label="Tên sản phẩm"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "Bắt buộc nhập",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Giá sản phẩm"
                    name="price"
                    rules={[
                        {
                            required: true,
                            message: "Bắt buộc nhập",
                        },
                        {
                            type: "number",
                            min: 0,
                            message: "Không được để số âm",
                        },
                    ]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
                    <Upload
                        multiple={true}
                        action="https://api.cloudinary.com/v1_1/ecommercer2021/image/upload"
                        listType="picture-card"
                        data={{
                            upload_preset: "demo-upload",
                        }}
                        onChange={onHandleChange}
                    >
                        <button
                            style={{
                                border: 0,
                                background: "none",
                            }}
                            type="button"
                        >
                            <PlusOutlined />
                            <div
                                style={{
                                    marginTop: 8,
                                }}
                            >
                                Upload
                            </div>
                        </button>
                    </Upload>
                </Form.Item>
                <Form.Item label="Tình trạng" name="available" valuePropName="checked">
                    <Switch />
                </Form.Item>
                <Form.Item label="Loại hàng" name="type">
                    <Radio.Group>
                        <Radio value="type1">Hàng cũ</Radio>
                        <Radio value="type2">Hàng mới</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="Danh mục" name="category">
                    <Select>
                        <Select.Option value="idCategory1">Danh mục 1</Select.Option>
                        <Select.Option value="idCategory2">Danh mục 2</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Mô tả sản phẩm" name="description">
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Thêm
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ProductAdd;
