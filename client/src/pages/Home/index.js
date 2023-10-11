import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GetAllBloodGroupsInInventory } from "../../apicalls/dashboard";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/loaderSlice";
import { Table, message } from "antd";
import { getLoggedInUserName } from "../../utils/helper"; // Add the correct import for the getLoggedInUserName function
import InventoryTable from "../../component/InventoryTable";


function Home() {
  const { currentUser } = useSelector((state) => state.users);
  const [bloodGroupsData, setBloodGroupData] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GetAllBloodGroupsInInventory();
      dispatch(setLoading(false));
      if (response.success) {
        setBloodGroupData(response.data);
        console.log(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const colours = [
    "#2B3467",
    "#1A5F7A",
    "#886218",
    "#245953",
    "#2C3333",
    "#804674",
    "#A84448",
    "#635985",
  ];

  return (
    <div>
     
      {/* {JSON.stringify(bloodGroupsData)} */}
      {currentUser.userType === "organization" && (
        <>
          <div className="grid grid-cols-4 gap-5 mt-2 mb-5">
            {bloodGroupsData.map((bloodGroup, index) => {
              const color = colours[index];
              return (
                <div
                  className={
                    "flex justify-between p-5 text-white rounded items-center"
                  }
                  style={{ backgroundColor: color }}
                >
                  <h1 className="text-5xl uppercase">
                    {bloodGroup.bloodGroup}
                  </h1>

                  <div className="flex flex-col justify-between">
                    <div className="flex justify-between gap-5">
                      <span>Total In</span>
                      <span>{bloodGroup.totalIn} ML</span>
                    </div>

                    <div className="flex justify-between gap-5">
                      <span>Total Out</span>
                      <span>{bloodGroup.totalOut} ML</span>
                    </div>

                    <div className="flex justify-between gap-5">
                      <span>Available</span>
                      <span>{bloodGroup.available} ML</span>
                    </div>
                  </div>
                </div>
              );
            })}

          
          </div>

          <span className="mt-5 text-xl font-semibold text-gray-700">
            Your Recent Inventory
          </span>

          <InventoryTable
            filters={{
              organization: currentUser._id,
            }}
            limit={5}
            userType={currentUser.userType}
          />
        </>
      )}


      {currentUser.userType === "donar" && (
        <div>
          <span className="mt-5 text-xl font-semibold text-gray-700">
            Your Recent Donations
          </span>

          <InventoryTable
            filters={{
              donar: currentUser._id,
            }}
            limit={5}
            userType={currentUser.userType}
          />
        </div>
      )}

{currentUser.userType === "hospital" && (
        <div>
          <span className="mt-5 text-xl font-semibold text-gray-700">
            Your Recent Requests / Consumptions
          </span>

          <InventoryTable
            filters={{
              hospital: currentUser._id,
            }}
            limit={5}
            userType={currentUser.userType}
          />
        </div>
      )}
      
    </div>
  );
}

export default Home;
