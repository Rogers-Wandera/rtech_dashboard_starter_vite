import RouteRoles from "@/hocs/verifyroles";

const ManageUsers = () => {
  return (
    <div>
      <h1>Hello Users</h1>
    </div>
  );
};

export default RouteRoles(ManageUsers);
