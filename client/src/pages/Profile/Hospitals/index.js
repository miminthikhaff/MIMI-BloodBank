import React from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../redux/loaderSlice";
import { Table, message } from "antd";
import { GetAllHospitalsOfAnOrganization } from '../../../apicalls/users';
import { getDateFormat } from "../../../utils/helper";

function Hospitals() {
  const [data, setData] = React.useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GetAllHospitalsOfAnOrganization();
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
      title: "Hospital Name",
      dataIndex: "hospitalName",
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
      title: "Address",
      dataIndex: "address"
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

export default Hospitals;
