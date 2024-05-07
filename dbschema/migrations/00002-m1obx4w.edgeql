CREATE MIGRATION m1obx4wn4czqdqg2jblv2sqfryijio27dsztjzk6uthueudc54ieea
    ONTO m1jbkm4y44e6nhehi3rzza5kfylv3ymj4iy6vx6fftwae3pj5523fq
{
  DROP TYPE default::BlogPost;
  CREATE TYPE default::Conversations {
      CREATE REQUIRED PROPERTY conversation_id: std::str;
      CREATE REQUIRED PROPERTY created_at: std::str;
      CREATE REQUIRED PROPERTY topic: std::str;
      CREATE REQUIRED PROPERTY user_id: std::str;
  };
  CREATE TYPE default::Messages {
      CREATE REQUIRED PROPERTY conversation_id: std::str;
      CREATE REQUIRED PROPERTY message_id: std::str;
      CREATE REQUIRED PROPERTY message_text: std::str;
      CREATE REQUIRED PROPERTY sender: std::str;
      CREATE REQUIRED PROPERTY timestamps: std::str {
          SET default := '';
      };
  };
};
