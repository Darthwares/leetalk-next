CREATE MIGRATION m1ftsev57rbcxnlc276svrzd5eoiet7fpxuj4ox2gkuamrbat35isa
    ONTO m1tdqnyfgawxfubv77mzhn62p25ot6ifot6obgcaf4f7xmbjhby2pa
{
  ALTER TYPE default::Comments {
      CREATE LINK message: default::Messages {
          ON TARGET DELETE ALLOW;
      };
      CREATE LINK user: default::Users {
          ON TARGET DELETE ALLOW;
      };
  };
  ALTER TYPE default::Messages {
      CREATE MULTI LINK comments := (.<message[IS default::Comments]);
      CREATE LINK conversation: default::Conversations {
          ON TARGET DELETE ALLOW;
      };
  };
  ALTER TYPE default::Users {
      CREATE MULTI LINK comments := (.<user[IS default::Comments]);
  };
  ALTER TYPE default::Conversations {
      CREATE MULTI LINK messages := (.<conversation[IS default::Messages]);
      CREATE LINK user: default::Users {
          ON TARGET DELETE ALLOW;
      };
  };
  ALTER TYPE default::Users {
      CREATE MULTI LINK conversations := (.<user[IS default::Conversations]);
  };
  ALTER TYPE default::Likes {
      CREATE LINK message: default::Messages {
          ON TARGET DELETE ALLOW;
      };
      CREATE LINK user: default::Users {
          ON TARGET DELETE ALLOW;
      };
  };
  ALTER TYPE default::Messages {
      CREATE MULTI LINK likes := (.<message[IS default::Likes]);
  };
  ALTER TYPE default::Users {
      CREATE MULTI LINK likes := (.<user[IS default::Likes]);
  };
};
