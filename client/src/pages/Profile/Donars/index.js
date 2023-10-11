import React from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../redux/loaderSlice";
import { message } from "antd";
import { GetAllDonarsOfAnOrganization } from "../../../apicalls/users";
import { getDateFormat } from "../../../utils/helper";
import { Table } from 'antd';


function Donars() {
  const [data, setData] = React.useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GetAllDonarsOfAnOrganization();
      dispatch(setLoading(false));
      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.mesage);
      dispatch(setLoading(false));
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "phone",
      dataIndex: "phone",
    },
    {
      title: "createdAt",
      dataIndex: "created",
      render: (text) => getDateFormat(text),
    },
  ];
  React.useEffect(() => {
    getData(); // Fetch data when component mounts
  }, []);

  return (
    <div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export default Donars;
