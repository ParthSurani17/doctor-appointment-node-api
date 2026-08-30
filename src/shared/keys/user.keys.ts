export const UserMessages = {
  NOT_FOUND: 'User not found.',
  DISPLAY_NAME_EXISTS: 'display name already exists.',
  SELF_PROFILE_CHANGE: 'You can only own profile change',
  ALREADY_EXISTS: 'User already exists.',
  SESSION_NOT_FOUND: 'User Session not found.',
  ALREADY_DISABLED: 'User is already disabled.',
  DISABLED: 'User is disabled.',
  ALREADY_ENABLED: 'User is already enabled.',
  ALREADY_BLOCKED: 'User is already blocked.',
  ALREADY_REPORTED: 'User is already reported.',
  ALREADY_A_FRIEND: 'You are already friends with this user.',
  ENABLED: 'User is enabled.',
  ALREADY_DELETED: 'User is already deleted.',
  DELETED: 'User is deleted.',
  SELF_STATUS_CHANGE: 'You can not change status of yourself.',
  INVITED_STATUS_CHANGE: 'status can\'t be change as your status is invited',
  ALREADY_REQUESTED: 'Already requested.',
  ALREADY_JOINED: 'Already joined.',
  ALREADY_INVITED: 'Invitation already sent to this user.',
  REQUEST_NOT_FOUND: 'Request not found.',
  NO_REQUEST_FOUND_YET: 'No request found yet.',
  FRIEND_NOT_FOUND: 'Friend not found.',
  BLOCK_NOT_FOUND: 'Blocking not found.',
  NO_FRIENDS_YET: 'Cannot find any friends yet.',
  ADMIN_AUTHORITY_REQUIRED: 'Need admin authority to access this.',
  PATIENT_AUTHORITY_REQUIRED: 'This account is not a patient account.',
  USER_CANNOT_BLOCK_THEMSELVES: 'Users can not block yourself.',
  ONE_MORE_USER_NOT_FOUND: 'One or more user not found',
  USER_CANNOT_RESTRICT_THEMSELVES: 'Users can not restrict yourself.',
  ALREADY_RESTRICTED: 'User is Already restricted',
  RESTRICTION_NOT_FOUND: 'Restriction not found',
};

export const TripMessages = {
  NOT_FOUND: 'Trip not found.',
  TRIP_DELETED: 'Trip is deleted',
  TRIP_OWNER_ACCESS_ONLY:
    'Only the owner of the trip can manage disabled users.',
  TRIP_DISABLED_FOR_USER: 'Trip post disable for you',
};

export const MediaMessage = {
  NOT_FOUND: 'Media not found.',
  DELETED: 'Media is deleted.',
  NOT_FOUND_YET: 'Cannot find any Media yet.',
};

export const LocationMessages = {
  NOT_FOUND: 'Location not found.',
  DELETED: 'Location is deleted.',
};

export const TripLikeMessages = {
  NOT_FOUND: 'Like not found.',
  DELETED: 'Like is deleted.',
  ALREADY_LIKED: 'You have already liked this post.',
};

export const TripCommentMessages = {
  NOT_FOUND: 'Trip Comment not found.',
  DELETED: ' Trip Comment is deleted.',
  NOT_FOUND_YET: 'Cannot find any Comments yet.',
};

export const FriendRequestMessages = {
  NOT_FOUND: 'Friend request not found.',
  DELETED: 'Friend request is deleted.',
  NOT_FOUND_YET: 'Cannot find any Friend requests yet.',
  NOT_SEND_YOUR_SELF: 'You cannot send a friend request to yourself.',
  ALREADY_FRIENDS:'You are already friends with this user',
  ALREADY_SENT_REQUEST:' Friend request already sent.'
};
export const TripJoinRequestMessages = {
  NOT_FOUND: 'Request not found.',
  DELETED: 'Request is deleted.',
  ALREADY_JOINED: 'You have already joined this trip-post.',
  ALREADY_INVITED: 'Invitation already sent to this user.',
  TRIP_NOT_FOUND_AND_NOT_ALLOW:
    'Trip not found or you do not have permission to invite users.',
  TRIP_ACCEPTED_OR_REJECTED:
    'Invitation not found or already accepted/rejected.',
};
export const BucketListMessages = {
  NOT_FOUND: 'Bucket list not found.',
  DELETED: 'Bucket list is deleted.',
  ALREADY_EXISTS: 'A bucket list with this title already exists.',
};

export const TripAlbumMessages = {
  NOT_FOUND: 'album media not found.',
  DELETED: ' album media is deleted.',
};
export const TripShareMessages = {
  NOT_FOUND: 'trip share not found.',
  DELETED: ' trip share post is deleted.',
};

export const PackageHighLightMessages = {
  NOT_FOUND: 'Highlight not found.',
  PACKAGE_HIGHLIGHT_DELETED: 'Highlight is deleted',
  ALREADY_EXISTS: 'Highlight with this name already exists.',
  NOT_EXISTS: 'One or more highlights do not exist',
};

export const PackageMessages = {
  NOT_FOUND: 'Travel package not found.',
  PACKAGE_DELETED: 'Travel package is deleted',
};

export const ActivityMessages = {
  NOT_FOUND: 'Travel activity not found.',
  PACKAGE_DELETED: 'Travel activity is deleted',
};

export const PackageCategoryMessages = {
  NOT_FOUND: 'Travel package category not found.',
  PACKAGE_CATEGORY_DELETED: 'Travel package category is deleted',
  ALREADY_EXISTS: 'Category with this name already exists.',
};

export const AdvertisementMessages = {
  NOT_FOUND: 'Advertisement not found.',
  ADVERTISEMENT_DELETED: 'Advertisement is deleted',
  ALREADY_EXISTS: 'Advertisement with this title already exists',
};

export const ChatMessages = {
  NOT_FOUND: 'Chat not found.',
  NOT_A_MEMBER: 'You are not a member of this chat',
  ALREADY_DELETED: 'chat is already deleted.',
  MORE_THAN_ONE_PARTICIPENTS_REQUIRES:
    'More than 1 user required for creating group',
  RECIPIENT_NOT_FOUND: 'Recipient not found',
};

export const AuthMessages = {
  ACCOUNT_DEACTIVATED: 'Consumer-User is disabled.',
  INVALID_EMAIL: 'Invalid email address.',
  INVALID_CREDENTIALS: 'Invalid credentials.',
  INVALID_CREDENTIALS_ERROR: 'Invalid email or password.',
  AUTH_HEADER_NOT_FOUND: 'Authorization header not found.',
  AUTH_HEADER_IS_NOT_BEARER: 'Authorization header is not of type \'Bearer\'.',
  INVALID_AUTH_HEADER_BEARER:
    'Authorization header value has too many parts. It must follow the pattern: \'Bearer xx.yy.zz\' where xx.yy.zz is a valid JWT token.',
  SESSION_NOT_FOUND: 'Session not found.',
  SESSION_ALREADY_EXPIRED: 'Session is already expired.',
  SESSION_EXPIRED: 'Session is expired.',
  USER_NOT_FOUND: 'User not found.',
  TOKEN_EXPIRED: 'Token is expired please try again',
  CONSUMER_USER_PHONE_VERIFIED: 'Consumer User\'s phone is already verified.',
  LOGOUT_SUCCESS: 'Logout successful.',
  EMAIL_EXIST: 'Entered email already exist in system.',
  PHONE_EXIST: 'Entered phone number already exist in system.',
  PASSWORD_PATTERN_ERROR:
    'Password must contain at least 1 uppercase letter 1 lowercase letter 1 digit and 1 special character.',
  SAME_AS_OLD_PASSWORD_ERROR:
    'New password should not be same as current password.',
  PASSWORD_MATCH_ERROR: 'Password and confirm password does not match.',
  TOKEN_IS_EXPIRED: 'Token has been expired. Please try again.',
  INVALID_PASSWORD_ERROR: 'Current password is incorrect.',
  ENTER_VALID_OTP: 'Invalid code. Please try again.',
  OTP_IS_EXPIRED: 'OTP has been expired. Please try again.',
  PHONENUMBER_PATTERN_ERROR:
    'Phone numbers must be between 10 and 16 characters.',
  CODE_PATTERN_ERROR: 'Code must be between 1 and 3 characters.',
  SOCIAL_ERROR: 'You have to enter socialId as well as socialType.',
  SOCIAL_MATCH_TYPE: 'Social type does not match.',
  SOCIAL_MATCH_ID: 'Social id does not match.',
  EMAIL_MATCH: 'Email does not match.',
  AUTH_ERROR: 'Authentication token invalid.',
  SOCIAL: 'Please login from your social account',
  EMAIL: 'Please login from your Email Id',
  IS_EXIST:
    'Your Google/Apple account is not connected. Please create an account and connect your Google/Apple account during onboarding.',
  UPDATE_PASSWORD: 'User password updated successfully.',
  RESET_TOKEN_INVALID: 'This password reset link is invalid or has expired.',
  };

export const NotificationServiceMessages = {
  title: {
    LIKE_ON_TRIP: 'Like Post',
    COMMENT_ON_TRIP: 'Comment Post',
    FOLLOWING_USER: 'Following',
    SHARE_TRIP: 'Share Post',
    SEND_FRIEND_REQUEST: 'Friend request send ',
    ACCEPT_FRIEND_REQUEST: 'Accepte friend request.',
    SEND_TRIP_REQUEST: 'Trip request send ',
    ACCEPT_TRIP_REQUEST: ' Accepte trip join request',
  },

  body: {
    LIKE_ON_TRIP: 'liked your post.',
    COMMENT_ON_TRIP_POST: 'commented on your post',
    SEND_FRIEND_REQUEST: 'requested to follow you',
    REJECT_FRIEND_REQUEST: 'reject your request',
    ACCEPT_FRIEND_REQUEST: 'accepted your friend request.',
    FOLLOWING_USER: 'started following you',
    DIRECT_ADD_TO_TRIP: 'You have been added to the trip',
    SEND_TRIP_REQUEST: 'requested to join your trip',
    ACCEPT_TRIP_REQUEST: 'accepted your trip join request',
    REMOVED_FROM_THE_TRIP: 'removed from a trip',
    SEND_TRIP_JOIN_INVITATION: 'You\'ve been invited to join a trip',
    ACCEPT_TRIP_JOIN_INVITATION:
      'Your invitation to join the trip has been accepted',
    TRIP_JOINED: 'Joined the trip',
  },
};
