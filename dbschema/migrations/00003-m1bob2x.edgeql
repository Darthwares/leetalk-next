CREATE MIGRATION m1bob2xn2yaspym2niswg7wecwehchuoblv4bsvbni5rgmlfedycuq
    ONTO m1obx4wn4czqdqg2jblv2sqfryijio27dsztjzk6uthueudc54ieea
{
  CREATE TYPE default::Users {
      CREATE REQUIRED PROPERTY email: std::str;
      CREATE REQUIRED PROPERTY image: std::str;
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE REQUIRED PROPERTY provider: std::str {
          SET default := '';
      };
      CREATE REQUIRED PROPERTY registered_at: std::str;
      CREATE REQUIRED PROPERTY user_id: std::str;
  };
};
