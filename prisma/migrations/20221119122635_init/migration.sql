-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "spotifyId" TEXT NOT NULL,
    "artists" TEXT[],
    "name" TEXT NOT NULL,
    "uri" TEXT NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Label" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Label_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SongsToUsers" (
    "userId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,

    CONSTRAINT "SongsToUsers_pkey" PRIMARY KEY ("userId","songId")
);

-- CreateTable
CREATE TABLE "SongsToLabels" (
    "labelId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "isSaved" BOOLEAN NOT NULL,

    CONSTRAINT "SongsToLabels_pkey" PRIMARY KEY ("labelId","songId")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" TEXT NOT NULL,
    "spotifyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistToSongs" (
    "playlistId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,

    CONSTRAINT "PlaylistToSongs_pkey" PRIMARY KEY ("playlistId","songId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Song_spotifyId_key" ON "Song"("spotifyId");

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_spotifyId_key" ON "Playlist"("spotifyId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Label" ADD CONSTRAINT "Label_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongsToUsers" ADD CONSTRAINT "SongsToUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongsToUsers" ADD CONSTRAINT "SongsToUsers_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongsToLabels" ADD CONSTRAINT "SongsToLabels_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongsToLabels" ADD CONSTRAINT "SongsToLabels_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistToSongs" ADD CONSTRAINT "PlaylistToSongs_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistToSongs" ADD CONSTRAINT "PlaylistToSongs_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
