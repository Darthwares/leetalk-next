CREATE MIGRATION m1fyzdod5oox5au44mb65e6lcxi763hhw3yowc525ow7mwqqimusba
    ONTO m1ypdj65ig33uk7khynzevvj6wiyuezovv3esj7yxogye7czbzkqcq
{
  ALTER TYPE default::Conversations {
      ALTER PROPERTY created_at {
          RESET OPTIONALITY;
      };
      ALTER PROPERTY user_id {
          RESET OPTIONALITY;
      };
  };
};
