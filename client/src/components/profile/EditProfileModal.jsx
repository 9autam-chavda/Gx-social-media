import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import Icon from '../icons/Icon';

import Avatar from '../common/Avatar';

import { userService } from '../../services/userService';

import { getErrorMessage } from '../../utils/api';

const EditProfileModal = ({
  open,
  profile,
  onClose,
  onUpdated,
}) => {
  const [username, setUsername] =
    useState('');

  const [bio, setBio] =
    useState('');

  const [image, setImage] =
    useState(null);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState('');

  // SYNC PROFILE DATA
  useEffect(() => {
    setUsername(
      profile?.username || ''
    );

    setBio(profile?.bio || '');

    setImage(null);

    setError('');
  }, [profile, open]);

  // IMAGE PREVIEW
  const preview = useMemo(() => {
    if (!image) return '';

    return URL.createObjectURL(
      image
    );
  }, [image]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;

    if (!file) {
      setImage(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please choose a valid image file.');
      setImage(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Profile photo must be 5MB or smaller.');
      setImage(null);
      return;
    }

    setError('');
    setImage(file);
  };

  // CLOSE MODAL
  if (!open) return null;

  // SUBMIT
  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setSubmitting(true);

    setError('');

    try {
      const updated =
        await userService.updateProfile({
          username,
          bio,
          image,
        });

      onUpdated(updated);

      onClose();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          'Unable to update profile'
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-end
        justify-center
        bg-black/50
        backdrop-blur-sm
        sm:items-center
      "
    >
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-lg
          overflow-hidden
          rounded-t-3xl
          bg-white
          shadow-2xl
          sm:rounded-3xl
        "
      >
        {/* HEADER */}
        <header
          className="
            flex items-center
            justify-between
            border-b border-zinc-100
            px-5 py-4
          "
        >
          <h2
            className="
              text-xl font-bold
              text-zinc-900
            "
          >
            Edit profile
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="
              grid h-10 w-10
              place-items-center
              rounded-full
              text-zinc-500
              transition-all duration-200
              hover:bg-zinc-100
              hover:text-zinc-900
            "
          >
            <Icon name="close" className="text-[18px]" />
          </button>
        </header>

        {/* BODY */}
        <div
          className="
            space-y-6
            p-5
          "
        >
          {/* IMAGE */}
          <label
            className="
              mx-auto flex
              cursor-pointer
              flex-col items-center
              gap-4
            "
          >
            <div
              className="
                relative
              "
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="
                    h-28 w-28 rounded-full
                    object-cover
                    ring-4 ring-zinc-100
                  "
                />
              ) : (
                <Avatar
                  user={profile}
                  size="xl"
                />
              )}

              <div
                className="
                  absolute bottom-1 right-1
                  grid h-9 w-9
                  place-items-center
                  rounded-full
                  bg-black text-white
                  shadow-lg
                "
              >
                  <Icon name="camera" className="text-[14px]" />
              </div>
            </div>

            <span
              className="
                text-sm font-medium
                text-zinc-600
              "
            >
              Change photo
            </span>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>

          {/* USERNAME */}
          <label
            className="
              block space-y-2
            "
          >
            <span
              className="
                text-sm font-semibold
                text-zinc-700
              "
            >
              Username
            </span>

            <input
              type="text"
              value={username}
              maxLength={20}
              minLength={3}
              onChange={(event) =>
                setUsername(
                  event.target.value
                )
              }
              className="
                w-full rounded-2xl
                border border-zinc-200
                bg-zinc-50
                px-4 py-3
                text-sm text-zinc-900
                outline-none
                transition-all duration-200
                placeholder:text-zinc-400
                focus:border-zinc-400
                focus:bg-white
              "
            />
          </label>

          {/* BIO */}
          <label
            className="
              block space-y-2
            "
          >
            <div
              className="
                flex items-center
                justify-between
              "
            >
              <span
                className="
                  text-sm font-semibold
                  text-zinc-700
                "
              >
                Bio
              </span>

              <span
                className="
                  text-xs text-zinc-400
                "
              >
                {bio.length}/200
              </span>
            </div>

            <textarea
              value={bio}
              maxLength={200}
              onChange={(event) =>
                setBio(
                  event.target.value
                )
              }
              className="
                min-h-[130px] w-full
                resize-none rounded-2xl
                border border-zinc-200
                bg-zinc-50
                px-4 py-3
                text-sm text-zinc-900
                outline-none
                transition-all duration-200
                placeholder:text-zinc-400
                focus:border-zinc-400
                focus:bg-white
              "
            />
          </label>

          {/* ERROR */}
          {error && (
            <p
              className="
                text-sm font-medium
                text-red-600
              "
            >
              {error}
            </p>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={submitting}
            className="
              w-full rounded-2xl
              bg-black
              px-5 py-3.5
              text-sm font-semibold
              text-white
              transition-all duration-200
              hover:bg-zinc-800
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {submitting
              ? 'Saving...'
              : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileModal;
