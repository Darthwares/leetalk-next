module default {
  type Users {
    required name: str;
    required user_id: str;
    required email: str;
    required image: str;
    required provider: str {
      default := ""
    };
     property registered_at -> datetime {
        default := datetime_current();
    }
  }
  
  type Conversations {
      required conversation_id -> str;
      property user_id -> str;
      property imageURL -> str;
      property viewCount -> int32 {
              default := 0;
      }
      property category -> str {
          default := '';
      }
      property published -> bool {
          default := false;
      }
      required topic -> str;
      property created_at -> datetime {
          default := datetime_current();
      }
  }
  
  type Messages {
    required message_id: str;
    required conversation_id: str;
    required sender: str;
    required message_text: str;
    property audio_url: str;
    property created_at -> datetime {
        default := datetime_current();
    }
  }

  type Comments {
    required comment_id: str;
    required message_id: str;  
    required user_id: str;     
    required comment_text: str;
    property created_at -> datetime {
        default := datetime_current();
    }
  }

  type Likes {
      required like_id: str;
      required message_id: str; 
      required user_id: str;    
      property created_at -> datetime {
          default := datetime_current();
      }
  }

}