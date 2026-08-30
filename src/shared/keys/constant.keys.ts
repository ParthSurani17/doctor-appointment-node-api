export const MAX_FIND_ALL_LIMIT = 50;
export const MEDIA_LIMIT = 200;

export const DATE_SETTINGS = {
  TRIP_START_DATE: 'startDate must be today or in the future',
  TRIP_END_DATE: 'endDate must be greater than startDate',
};

export enum TripTypeEnum {
  PastTrip = 'PAST',
  UpcomingTrip = 'UPCOMING',
}

export const ApiEnumNameConst = {
  include: 'include',
};

export enum TripIncludeEnum {
  TripLike = 'tripLike',
  TripComment = 'tripComment',
  Location = 'location',
  TripAlbum = 'tripAlbum',
  TripRequest = 'tripRequest',
  User = 'user',
}

export enum SingalTripIncludeEnum {
  TripAlbum = 'tripAlbum',
  TripDisabledUsers = 'tripDisabledUsers',
  TripRequest = 'tripRequest',
  User = 'user',
}
export enum CommentIncludeEnum {
  Trip = 'trip',
  User = 'user',
}
export enum DisableUserIncludeEnum {
  Trip = 'trip',
  User = 'user',
}
export enum TripLikeIncludeEnum {
  Trip = 'trip',
  User = 'user',
}
export enum TripAlbumIncludeEnum {
  Trip = 'trip',
  User = 'user',
}

export enum BucketListIncludeEnum {
  User = 'user',
}
export enum BlockUserIncludeEnum {
  BlockingUser = 'blockingUser',
  BlockedUser = 'blockedUser',
}

export enum JoinTripIncludeEnum {
  TripLike = 'tripLike',
  TripComment = 'tripComment',
  Location = 'location',
  TripAlbum = 'tripAlbum',
  User = 'user',
}
export enum FriendRequestIncludeEnum {
  Sender = 'sender',
  Receiver = 'receiver',
}

export enum NotificationIncludeEnum {
  Sender = 'sender',
  Receiver = 'receiver',
}

export enum ChatMemberIncludeEnum {
  Chat = 'chat',
  User = 'user',
}

export enum ChatMessageIncludeEnum {
  Chat = 'chat',
  Sender = 'sender',
}

export enum FriendStatusEnum {
  FriendsOfFriend = 'friendOfFriend',
  Friend = 'friend',
}

export enum JoinTripListIncludeEnum {
  TripOwner = 'tripOwner',
  Requester = 'requester',
}

//------------------------- admin include enum ----------------------------

export enum TravelPackageEnum {
  Highlight = 'highlights',
  Location = 'location',
}

export enum ActivityAlbumIncludeEnum {
  Activity = 'activity',
}

export enum ActivityIncludeEnum {
  ActivityLocation = 'activityLocation',
}

export enum RestrictedUserIncludeEnum {
  RestrictingUser = 'restrictingUser',
  RestrictedUser = 'restrictedUser',
}
export enum ReportedUserIncludeEnum {
  ReportingUser = 'reportingUser',
  ReportedUser = 'reportedUser',
}

export enum AdminTripIncludeEnum {
  Location = 'location',
}

export enum ReportedTripIncludeEnum {
  TripReportingUser = 'tripReportingUser',
  Trip = 'trip',
}
