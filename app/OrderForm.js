'use client';
import React, { useState } from 'react';
import { Form, Input, InputNumber, Radio, Space, Typography, Button, Card, message } from 'antd';
import { db } from '/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const { Title, Text } = Typography;

const OrderForm = () => {
  const [form] = Form.useForm();
  const [deliveryMethod, setDeliveryMethod] = useState('711');
  const [total, setTotal] = useState(0);

  const calculateTotal = (values) => {
    const calendar = (values?.calendar?.quantity || 0) * 699;
    const polaroid = (values?.polaroid?.quantity || 0) * 100;
    const shipping = 60;
    const total = calendar + polaroid;
    return total > 2000 ? total : total + shipping;
  };

  const onValuesChange = (_, allValues) => {
    setTotal(calculateTotal(allValues));
    if (allValues.deliveryMethod) {
      setDeliveryMethod(allValues.deliveryMethod);
    }
  };

  const onFinish = async (values) => {
    try {
      const orderData = {
        ...values,
        total,
        createdAt: serverTimestamp(),
        havePaid: false,
      };
      await addDoc(collection(db, 'sheena-202411-calendar'), orderData);

      message.success('感謝您的訂購！', 4);
      form.resetFields();
      setTotal(0);
    } catch (error) {
      message.success('訂單提交失敗 請稍後再度嘗試！');
    } finally {
    }
  };

  return (
    <Card className='max-w-xl mx-auto my-8'>
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        initialValues={{
          deliveryMethod: '711',
          calendar: { quantity: 0, signed: false },
          polaroid: { quantity: 0, signed: false },
        }}
      >
        <Title level={3}>2025年 Sheena熙蒳 桌曆預購表</Title>
        <Space direction='vertical' className='mb-2'>
          <Text strong>本次活動將有 10% 作為公益款項</Text>
          <Text>699/本</Text>
          <Text> 加購拍立得(4款隨機) $100/張</Text>
          <Text type='danger'>玉山銀行 808 0370979124140</Text>
          <Text>只接受轉帳 (轉帳後告知查帳) </Text>
          <Text>滿兩千免運 可訂購時間 即日 ~ 11 月底 預計 12 月開始出貨</Text>
        </Space>

        <div className='flex gap-4'>
          <Form.Item
            className='mb-2 font-bold'
            name='name'
            label='姓名'
            rules={[{ required: true, message: '請輸入姓名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            className='mb-2 font-bold'
            name='phone'
            label='電話'
            rules={[
              { required: true, message: '請輸入電話' },
              { pattern: /^09\d{8}$/, message: '請輸入正確的手機號碼格式' },
              { max: 10, message: '請輸入 10 碼' },
            ]}
          >
            <Input />
          </Form.Item>
        </div>
        <div className='flex gap-4'>
          <Form.Item label='桌曆' className='w-1/2 font-bold'>
            <Space direction='vertical'>
              <Form.Item name={['calendar', 'quantity']} className='flex w-full mb-0'>
                <InputNumber min={0} placeholder='數量' />
              </Form.Item>
              <Form.Item name={['calendar', 'signed']} className='mb-0'>
                <Radio.Group className='font-normal'>
                  <Radio value={true}>需要簽名</Radio>
                  <Radio value={false}>不需簽名</Radio>
                </Radio.Group>
              </Form.Item>
            </Space>
          </Form.Item>

          <Form.Item label='拍立得' className='w-1/2 font-bold'>
            <Space direction='vertical'>
              <Form.Item name={['polaroid', 'quantity']} className='mb-0'>
                <InputNumber min={0} placeholder='數量' />
              </Form.Item>
              <Form.Item name={['polaroid', 'signed']} className='mb-0'>
                <Radio.Group className='font-normal'>
                  <Radio value={true}>需要簽名</Radio>
                  <Radio value={false}>不需簽名</Radio>
                </Radio.Group>
              </Form.Item>
            </Space>
          </Form.Item>
        </div>

        <div className={`flex gap-4 ${deliveryMethod === '711' ? '' : 'flex-wrap'}`}>
          <Form.Item
            className='w-1/2 font-bold'
            name='storeId'
            label='711 配送門市'
            rules={[{ required: true, message: '請填寫門市' }]}
          >
            <Input placeholder='請填寫門市' />
          </Form.Item>

          <Form.Item
            className='w-1/2 font-bold'
            name='bankCode'
            label='匯款帳戶末五碼'
            rules={[
              { required: true, message: '請輸入匯款帳戶末五碼' },
              { pattern: /^\d{5}$/, message: '請輸入正確的末五碼格式' },
            ]}
          >
            <Input maxLength={5} />
          </Form.Item>
        </div>

        {/* 總金額顯示 */}
        <div className='text-right mb-6'>
          <Title level={4}>總金額：NT$ {total}</Title>
        </div>

        {/* 送出按鈕 */}
        <Form.Item>
          <Button type='primary' htmlType='submit' className='w-full'>
            確認送出
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default OrderForm;
