CREATE MIGRATION m1aclzu5mhzvamwffsiuudg5fo3xvvraqtgic6dskf34zohv6ttf4q
    ONTO m1tmwd7j7yj5ey5cd7wjy46pi5oci7fgq7df7unsxckeqyoglfvy4q
{
  CREATE TYPE default::Comments {
      CREATE REQUIRED PROPERTY comment_id: std::str;
      CREATE REQUIRED PROPERTY comment_text: std::str;
      CREATE PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY message_id: std::str;
      CREATE REQUIRED PROPERTY user_id: std::str;
  };
  CREATE TYPE default::Likes {
      CREATE PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY like_id: std::str;
      CREATE REQUIRED PROPERTY message_id: std::str;
      CREATE REQUIRED PROPERTY user_id: std::str;
  };
};
