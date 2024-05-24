CREATE MIGRATION m15segxlglfup5mryyavonnjpn7rosbabuoki2w5dhfgfcpgl5aouq
    ONTO m1ftsev57rbcxnlc276svrzd5eoiet7fpxuj4ox2gkuamrbat35isa
{
  ALTER TYPE default::Messages {
      DROP LINK comments;
      DROP LINK likes;
  };
  ALTER TYPE default::Comments {
      DROP LINK message;
  };
  ALTER TYPE default::Users {
      DROP LINK comments;
      DROP LINK conversations;
      DROP LINK likes;
  };
  ALTER TYPE default::Comments {
      DROP LINK user;
  };
  ALTER TYPE default::Conversations {
      DROP LINK messages;
      DROP LINK user;
  };
  ALTER TYPE default::Likes {
      DROP LINK message;
      DROP LINK user;
  };
  ALTER TYPE default::Messages {
      DROP LINK conversation;
  };
};
