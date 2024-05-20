CREATE MIGRATION m1tdqnyfgawxfubv77mzhn62p25ot6ifot6obgcaf4f7xmbjhby2pa
    ONTO m1aclzu5mhzvamwffsiuudg5fo3xvvraqtgic6dskf34zohv6ttf4q
{
  ALTER TYPE default::Conversations {
      CREATE PROPERTY category: std::str {
          SET default := '';
      };
      CREATE PROPERTY published: std::bool {
          SET default := false;
      };
  };
};
