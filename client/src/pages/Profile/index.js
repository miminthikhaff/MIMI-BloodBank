import React from "react";
import { useSelector } from "react-redux";
import { Tabs } from "antd";
import Inventory from "./Inventory";
import Donars from "./Donars";
import Hospitals from "./Hospitals";
import Organizations from "./Organizations";
import InventoryTable from "../../component/InventoryTable";
import { GetCurrentUser } from "../../apicalls/users";
function Profile() {
  const { currentUser } = useSelector((state) => state.users);

  return (
    <div>
      <Tabs>
        {currentUser.userType === "organization" && (
          <>
            <Tabs.TabPane tab="Inventory" key="1">
              <Inventory />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Donars" key="2">
              <Donars />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Hospitals" key="3">
              <Hospitals />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Organizations" key="4">
              <Organizations />
            </Tabs.TabPane>
          </>
        )}

        {currentUser.userType === "donar" && (
          <>
            <Tabs.TabPane tab="Donations" key="5">
            <InventoryTable
                filters={{
                  inventoryType: "in",
                  donar: currentUser._id,
                }}
                userType="donar"
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Organizations" key="6">
              <Organizations userType="donar" />
            </Tabs.TabPane>
          </>
        )}

        {currentUser.userType === "hospital" && (
          <>
            <Tabs.TabPane tab="Consumptions" key="7">
              <InventoryTable
                filters={{
                  inventoryType: "out",
                  hospital: currentUser._id,
                }}
                userType="hospital"
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Organizations" key="8">
              <Organizations userType="hospital" />
            </Tabs.TabPane>
          </>
        )}
      </Tabs>
    </div>
  );
}

export default Profile;
