import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import Avatar from '../components/common/Avatar';
import EmptyState from '../components/common/EmptyState';
import { GridSkeleton } from '../components/common/Skeletons';
import Icon from '../components/icons/Icon';
import EditProfileModal from '../components/profile/EditProfileModal';
import ProfileMediaCard from '../components/profile/ProfileMediaCard';
import ProfileThoughtCard from '../components/profile/ProfileThoughtCard';
import SavedGrid from '../components/saved/SavedGrid';
import FollowersModal from '../components/user/FollowersModal';
import FollowingModal from '../components/user/FollowingModal';
import UserStats from '../components/user/UserStats';
import { useAuth } from '../hooks/useAuth';
import { usePaginatedPosts } from '../hooks/usePaginatedPosts';
import { useProfile } from '../hooks/useProfile';
import { userService } from '../services/userService';
import { getErrorMessage } from '../utils/api';

const Profile = () => {
  const { username } = useParams();

  const { user, updateUser } = useAuth();

  const {
    profile,
    setProfile,
    posts,
    loading,
    error,
  } = useProfile(username);

  const [activeTab, setActiveTab] = useState('media');
  const [editOpen, setEditOpen] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);

  const fetchSaved = useCallback(
    (params) => userService.getSaved(params),
    []
  );

  const saved = usePaginatedPosts(fetchSaved, {
    limit: 18,
    immediate: username === user?.username,
  });

  const isOwnProfile = username === user?.username;
  const isFollowing = Boolean(profile?.isFollowing);

  const mediaPosts = posts.filter(
    (post) => post?.type === 'image' || post?.type === 'video'
  );

  const textPosts = posts.filter((post) => post?.type === 'text');

  if (loading)
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <section className="app-panel p-4 sm:p-7">
          <div className="flex gap-4 sm:gap-7">
            <div className="skeleton h-20 w-20 shrink-0 rounded-full sm:h-32 sm:w-32" />
            <div className="min-w-0 flex-1 space-y-3">
              <div className="skeleton h-7 w-48 rounded-full" />
              <div className="skeleton h-4 w-32 rounded-full" />
              <div className="skeleton h-16 w-full max-w-lg rounded-2xl" />
              <div className="flex gap-2">
                {[0, 1, 2].map((item) => <div className="skeleton h-12 w-24 rounded-2xl" key={item} />)}
              </div>
            </div>
          </div>
        </section>
        <GridSkeleton />
      </div>
    );

  if (error)
    return (
      <EmptyState
        title="Profile unavailable"
        description={error}
      />
    );

  if (!profile)
    return (
      <EmptyState title="Profile not found" />
    );

  const handleFollow = async () => {
    setFollowLoading(true);
    setActionError('');

    try {
      if (isFollowing) {
        await userService.unfollow(profile.id);
        setProfile((current) => ({
          ...current,
          isFollowing: false,
          followerCount: Math.max(0, (current.followerCount || 0) - 1),
        }));
      } else {
        await userService.follow(profile.id);
        setProfile((current) => ({
          ...current,
          isFollowing: true,
          followerCount: (current.followerCount || 0) + 1,
        }));
      }
    } catch (err) {
      setActionError(getErrorMessage(err, 'Unable to update follow status'));
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUpdated = (updated) => {
    setProfile((current) => ({
      ...current,
      ...updated,
    }));
    updateUser(updated);
  };

  return (
    <div className="pb-8">
      <section className="app-panel mx-auto w-full max-w-4xl overflow-hidden">
        <div className="px-4 py-5 sm:px-7 sm:py-7 lg:px-8">
          <div className="flex gap-4 sm:gap-7 md:gap-9">
            <div className="flex-shrink-0">
              <Avatar user={profile} size="lg" className="h-20 w-20 sm:h-32 sm:w-32" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div>
                  <h1 className="text-xl font-black tracking-tight text-ink sm:text-3xl">
                    @{profile.username}
                  </h1>
                  {profile.name && (
                    <p className="mt-1 text-sm font-semibold text-ink-muted">
                      {profile.name}
                    </p>
                  )}
                </div>

                {isOwnProfile ? (
                  <button
                    className="secondary-button min-h-10 px-4 py-2 text-xs sm:px-5 sm:text-sm"
                    onClick={() => setEditOpen(true)}
                    type="button"
                  >
                    Edit profile
                  </button>
                ) : (
                  <button
                    className="primary-button min-h-10 px-4 py-2 text-xs disabled:opacity-50 sm:px-5 sm:text-sm"
                    disabled={followLoading}
                    onClick={handleFollow}
                    type="button"
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>

              {(profile.bio || !isOwnProfile) && (
                <p className="mt-3 max-w-2xl whitespace-pre-wrap text-sm leading-6 text-ink sm:mt-4 sm:text-[15px]">
                  {profile.bio || 'No bio'}
                </p>
              )}

              <UserStats
                postsCount={posts.length}
                followersCount={
                  profile.followerCount || 0
                }
                followingCount={
                  profile.followingCount || 0
                }
                onFollowersClick={() =>
                  setFollowersOpen(true)
                }
                onFollowingClick={() =>
                  setFollowingOpen(true)
                }
              />

              {actionError && (
                <p className="app-alert mt-3 sm:mt-4">{actionError}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-4 w-full max-w-4xl">
        <div className="border-b border-line" role="tablist" aria-label="Profile sections">
          <div className="flex items-center justify-center gap-6 sm:justify-start sm:gap-8">
            {[
              { id: 'media', label: 'Posts' },
              { id: 'thoughts', label: 'Thoughts' },
              ...(isOwnProfile
                ? [{ id: 'saved', label: 'Saved', icon: () => <Icon name="bookmark" /> }]
                : []),
            ].map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                tabIndex={activeTab === tab.id ? 0 : -1}
                className={`inline-flex min-h-11 items-center gap-2 border-b-2 px-1 text-sm font-bold transition-colors duration-150 ${
                  activeTab === tab.id
                    ? 'border-brand text-brand'
                    : 'border-transparent text-ink-muted hover:text-ink'
                }`}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                {tab.icon && (
                  <tab.icon className="text-base" />
                )}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-96">
          {activeTab === 'media' && (
            <div className="py-4 sm:py-6">
              {mediaPosts.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3">
                  {mediaPosts.map((post) => (
                    <ProfileMediaCard
                      key={post?._id || post?.id}
                      post={post}
                      profile={profile}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No media posts yet"
                  description="Share photos and videos to get started"
                />
              )}
            </div>
          )}

          {activeTab === 'thoughts' && (
            <div className="py-4 sm:py-6">
              {textPosts.length > 0 ? (
                <div className="grid grid-cols-1 gap-2 sm:gap-4 md:grid-cols-2">
                  {textPosts.map((post) => (
                    <ProfileThoughtCard
                      key={post?._id || post?.id}
                      post={post}
                      profile={profile}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No thoughts yet"
                  description="Share your thoughts to start a conversation"
                />
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <>
              {saved.loading ? (
                <div className="py-4 sm:py-6">
                  <GridSkeleton />
                </div>
              ) : saved.error ? (
                <div className="py-4 sm:py-6">
                  <EmptyState
                    icon={() => <Icon name="bookmark" />}
                    title="Saved posts unavailable"
                    description={saved.error}
                  />
                </div>
              ) : (
                <>
                  <div className="py-4 sm:py-6">
                    <SavedGrid
                      posts={saved.posts}
                      emptyTitle="No saved posts yet"
                      emptyDescription="Bookmarked posts will appear here"
                    />
                  </div>

                  {saved.pagination?.hasNext && (
                    <div className="flex justify-center px-2 py-4 sm:px-6 sm:py-8 lg:px-8">
                      <button
                        className="secondary-button px-5 py-2.5 text-sm disabled:opacity-50"
                        onClick={saved.loadMore}
                        disabled={saved.loadingMore}
                        type="button"
                      >
                        {saved.loadingMore ? 'Loading...' : 'Load more'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>

      {followersOpen && (
        <FollowersModal
          open={followersOpen}
          userId={profile.id}
          count={profile.followerCount || 0}
          onClose={() => setFollowersOpen(false)}
        />
      )}

      {followingOpen && (
        <FollowingModal
          open={followingOpen}
          userId={profile.id}
          count={profile.followingCount || 0}
          isOwnProfile={isOwnProfile}
          onFollowingDelta={(delta) => {
            if (!isOwnProfile) return;

            setProfile((current) => ({
              ...current,
              followingCount: Math.max(
                0,
                (current.followingCount || 0) + delta
              ),
            }));
          }}
          onClose={() => setFollowingOpen(false)}
        />
      )}

      <EditProfileModal
        open={editOpen}
        profile={profile}
        onClose={() => setEditOpen(false)}
        onUpdated={handleUpdated}
      />
    </div>
  );
};

export default Profile;
