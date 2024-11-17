'use client';

import { Card, Col, Row, Statistic, Table, message } from 'antd';
import { collection, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { ceil, sumBy } from 'lodash-es';
import { useEffect, useState } from 'react';
import { db } from '/firebase';
import dayjs from 'dayjs';
import { Stamp } from 'lucide-react';

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
    render: (storeId) => {
      return storeId?.replace('門市', '') || '-';
    },
  },
  {
    title: '銀行五碼',
    dataIndex: 'bankCode',
    key: 'bankCode',
  },

  {
    title: '桌曆',
    dataIndex: ['calendar', 'quantity'],
    key: 'calendarQuantity',
    render: (value, whole) => {
      const sign = whole?.calendar?.signed;
      return (
        <div className='flex gap-2 items-center'>
          {value} {sign && <Stamp size={16} strokeWidth={1.5} />}
        </div>
      );
    },
  },
  {
    title: '簽名照',
    dataIndex: ['polaroid', 'quantity'],
    key: 'polaroidQuantity',
    render: (value, whole) => {
      const sign = whole?.polaroid?.signed;
      return (
        <div className='flex gap-2 items-center'>
          {value} {sign && <Stamp size={16} strokeWidth={1.5} />}
        </div>
      );
    },
  },
  {
    title: '下訂時間',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (createdAt) => {
      const displayTime = dayjs(createdAt.seconds * 1000).format('YYYY-MM-DD');
      return displayTime;
    },
  },
  {
    title: '總價',
    dataIndex: 'total',
    key: 'total',
    render: (total) => {
      return <h3 className='font-bold'>{total}</h3>;
    },
  },
  {
    title: '是否付款',
    dataIndex: 'havePaid',
    key: 'havePaid',
    render: (paid, record) => {
      return (
        <button
          onDoubleClick={async (e) => {
            e.stopPropagation();
            try {
              const docRef = doc(db, 'sheena-202411-calendar', record.id);
              await updateDoc(docRef, {
                havePaid: !paid,
              });
              message.success('付款狀態已更新');
              // 重新讀取
              record.refetch();
            } catch (error) {
              console.error('Error updating payment status:', error);
              message.error('更新失敗');
            }
          }}
          className={`px-4 py-1 rounded whitespace-nowrap ${
            paid ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {paid ? '已付款' : '未付款'}
        </button>
      );
    },
  },
  {
    title: '是否出貨',
    dataIndex: 'haveSend',
    key: 'haveSend',
    render: (send, record) => {
      return (
        <button
          onDoubleClick={async (e) => {
            e.stopPropagation();
            try {
              const docRef = doc(db, 'sheena-202411-calendar', record.id);
              await updateDoc(docRef, {
                haveSend: !send,
              });
              message.success('出貨狀態已更新');
              // 重新讀取
              record.refetch();
            } catch (error) {
              console.error('Error updating payment status:', error);
              message.error('更新失敗');
            }
          }}
          className={`px-4 py-1 rounded whitespace-nowrap ${
            send ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {send ? '已出貨' : '未出貨'}
        </button>
      );
    },
  },
];

const Page = () => {
  const [data, setData] = useState([]);
  const totalSum = sumBy(data, 'total') || 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'sheena-202411-calendar'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const dataList = querySnapshot.docs.map((doc) => ({
          id: doc.id, // 從 doc 取得 id
          ...doc.data(), // 展開其他資料
          refetch: fetchData, // 加入重新讀取函數
        }));

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
