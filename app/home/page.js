'use client';

import { Card, Col, Row, Statistic, Table } from 'antd';
import { collection, getDocs } from 'firebase/firestore';
import { ceil, sumBy } from 'lodash-es';
import { useEffect, useState } from 'react';
import { db } from '/firebase';

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '電話',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '門市',
    dataIndex: 'storeId',
    key: 'storeId',
  },
  // {
  //   title: '配送方式',
  //   dataIndex: 'deliveryMethod',
  //   key: 'deliveryMethod',
  // },
  {
    title: '銀行末五碼',
    dataIndex: 'bankCode',
    key: 'bankCode',
  },
  {
    title: '總價',
    dataIndex: 'total',
    key: 'total',
  },
  {
    title: '是否付款',
    dataIndex: 'havePaid',
    key: 'havePaid',
    render: (text) => (text ? 'Yes' : 'No'),
  },
  {
    title: '桌曆數量',
    dataIndex: ['calendar', 'quantity'],
    key: 'calendarQuantity',
    render: (value, whole) => {
      const sign = whole?.calendar?.signed ? ' (需簽)' : '';
      return `${value} ${sign}`;
    },
  },
  {
    title: '簽名照數量',
    dataIndex: ['polaroid', 'quantity'],
    key: 'polaroidQuantity',
    render: (value, whole) => {
      const sign = whole?.calendar?.signed ? ' (需簽)' : '';
      return `${value} ${sign}`;
    },
  },
  {
    title: '建立時間',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (createdAt) => {
      const date = new Date(createdAt.seconds * 1000);
      return date.toLocaleString();
    },
  },
];

const Page = () => {
  const [data, setData] = useState([]);
  const totalSum = sumBy(data, 'total') || 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'sheena-202411-calendar'));
        const dataList = querySnapshot.docs.map((doc) => doc.data());
        setData(dataList);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className='bg-white min-h-screen p-10'>
      <Table bordered columns={columns} dataSource={data} />

      <Row gutter={16}>
        <Col span={4}>
          <Card bordered={false}>
            <Statistic
              title='Total'
              value={totalSum}
              valueStyle={{ color: '#3f8600' }}
              prefix='$'
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card bordered={false}>
            <Statistic title='Fee (8%)' value={ceil(totalSum * 0.08)} prefix='$' />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Page;
