![Dirty Forms Logo](https://raw.githubusercontent.com/snikch/jquery.dirtyforms/master/branding/dirty-forms-logo.png)

# Releases

This document covers both the versioning process and the release procedure.

## Versioning

We are using [semantic versioning](http://semver.org/). As per the document, modifications to the codebase must be separated into 3 main categories. So it follows that the release procedure will include 3 different types of releases.

1. ### Patch Releases

    Patches are for backward compatible bug fixes. A patch must not make any modifications to the public API. This may include things that do not modify the codebase directly, such as updating documentation or the build script.

    Each patch should be put into its own branch, and the branch should be named in the format `patch-x`, where x is either the GitHub issue number or, if no issue exists, a short descriptive name of the fix.

    A patch release will simply increment the patch version. For example, a patch to `2.0.1` would increment the number to `2.0.2`.

2. ### Minor Releases

    A minor release may have new features added to the codebase that do not break backward compatibility. This means when someone upgrades there should be no code changes necessary to complete the upgrade, and the expected behavior of existing code should be the same.

    A minor release will increment the minor version and reset the patch version to 0. For example, a minor release at the current version `2.0.1` would increment the number to `2.1.0`.

3. ### Major Releases

    A major release may contain features that are not backward compatible. However, it is still best to keep backward compatibility if possible. The major release is the time to remove a deprecated feature provided that ample time has passed since the end users were notified the feature is deprecated. It is also the time to add features that change (correct bad) behavior that can potentially break the end users' applications.

    A major release will increment the major version number and reset both the minor and patch version to 0. For example a major release at the current version `2.1.2` would increment the version to `3.0.0`.

    Major releases should not just happen automatically when there is a feature that belongs in a major release. They should contain several features and feature requests that are contributed by the community. A good strategy is to open an issue and request feedback for ideas about what to change, since during a major release there is the most flexibility about what kinds of features can be implemented, then give the community some time (weeks) to respond.

## Features

When working with features, use a separate branch for each new feature. Each branch should be prefixed with `feature-` followed by either an issue number (if applicable) or a short descriptive name of the feature. When the feature is complete, it should be tested/reviewed to determine if any non-backward-compatible change has been made and altered (if possible) to make it backward compatible.

If the feature is not backward compatible, its branch prefix should be changed (by renaming the branch) from `feature-` to `vnext-`. In general, these branches should be committed to the main repository and accumulated until there is enough reason to perform a major release, allowing minor releases and patches to take precedence.

## Preparing for a Release

First, determine whether a patch, minor, or major release is required (see the [Versioning](#versioning) section above). If you have a mix of patches and minor features to release, it is best to do a patch release first followed by a minor release. Similarly, you should do a release with patches and minor features before doing a major release.

Once you have determined what features will go into each release (and in what order) merge the changes from the first batch into the `master` branch and fix any merge conflicts accordingly. If you have any additional releases to do, wait until after the first release is complete before starting the additional releases, so they are committed to the repository in the right sequence.

> **NOTE:** You should never need to update the distribution repositories directly. There is a copy of each of the files that will be deployed there in the development repository that you can edit as needed before the release. All changes flow from the development (central) repository to the distribution repositories during a release, the flow of assets should always be one-way.

Before each release, you should test the merged code to ensure it functions in each major browser (Chrome, Fireforx, IE, and Safari). Each feature/patch should be tested to ensure it accomplishes the desired behavior when merged with the other features in the release.

You should also run JSHint on the code and fix any problems it identifies by running the following commands at the root directory of the project.

```
npm install
npm test
```

## Release Procedure

> **NOTE:** Releases can only be done using the `master` branch.

1. Follow the steps in [Preparing for a Release](#preparing-for-a-release) to update the master branch in your local repository.

2. Review the commits in the <a href="https://github.com/snikch/jquery.dirtyforms/commits/master" target="_blank">central repository's `master` branch</a>. Leave the browser window open so you can more easily identify the new commits. This will be necessary later to create a change log.

3. Push the code to the `master` branch in the central repository at https://github.com/snikch/jquery.dirtyforms

    > **NOTE:** Collaborator permission is required to perform this.

4. Login to the [jquery.dirtyforms MyGet feed](https://www.myget.org/BuildSource/List/jquery-dirtyforms) (you should navigate to the `Build Services` page).

    > **NOTE:** Permission is required to perform this. If you don't have permission, please create an account at MyGet and [open an issue](https://github.com/snikch/jquery.dirtyforms/issues/new) to request permission (collaborators only).

5. Next to the `snikch/jquery.dirtyforms` build source, click the edit icon (the little pencil). 

    **Patch Release:** Review that the settings are correct to produce the next patch version (should be, but it's always good to double-check).

    **Minor Release:** Click `reset` on the build counter. Increment the minor version in the `Version format` field. 

        Example: Change `2.1.{0}` to `2.2.{0}`.

    **Major Release:** Click `reset` on the build counter. Increment the major version in the `Version format` field and set the minor version to `0`.
        
        Example: Change `2.1.{0}` to `3.0.{0}`.

    Click `Cancel` if you didn't change anything or `Save` if you did.

    > **NOTE:** You may need to resize the browser in order to see the save and cancel buttons.

6. Click the build button and then wait for the build to complete (around 5 - 10 minutes...time to get some coffee).

7. If the build failed, you can click the word `failed` to review the (pretty detailed) build log to determine what is amiss. But as long as you didn't update the `gulpfile.js` or `package.json` file in the root of the project, you should be seeing `successful`.

8. Perform steps necessary for deployment of package managers/CDN

    **NPM:** Click the [Packages tab](https://www.myget.org/feed/Packages/jquery-dirtyforms) in MyGet. Click the `Push Latest...` button. In the dropdown, choose `Npm packages`. The "Push package to another feed" dialog will appear. Leave the default settings. Click the `Push` button. The packages should appear on [NPM](https://www.npmjs.com/search?q=jquery.dirtyforms) in about 10-15 minutes.

    **NuGet:** Click the [Packages tab](https://www.myget.org/feed/Packages/jquery-dirtyforms) in MyGet. Click the `Push Latest...` button. In the dropdown, choose `NuGet packages`. The "Push package to another feed" dialog will appear. Leave the default settings. Click the `Push` button. The packages should appear on [NuGet Gallery](https://www.nuget.org/packages?q=jquery.dirtyforms) in about 5-10 minutes.

    **Bower:** The build process created a Git tag with the version number. No additional steps are required.

    **jsDelivr:** The jsDeliver bot will automatically detect the Git tag with the version number. No additional steps are required. The bot may take 10 minutes or so to copy the assets of the new version to the CDN, after which you can verify it by copying and pasting `//cdn.jsdelivr.net/g/jquery.dirtyforms@1.1.0` into the browser and replacing the version number at the end with the version number of the current release.

9. Update the change log.

  1. Open a **new browser window/tab** and review the commits in the <a href="https://github.com/snikch/jquery.dirtyforms/commits/master" target="_blank">central repository's `master` branch</a>.

  2. Compare it against the browser window/tab that you opened in step 2 and identify the commits that were added to this release.

  3. <a href="https://github.com/snikch/jquery.dirtyforms/releases/new" target="_blank">Click here to draft a new release</a> in a new window/tab.

  4. Select the version number of this release from the `Tag version` dropdown. 

  5. Copy and paste the version number into the `Release title`. 

  6. Add the header `### Change Log`. 

  7. Summarize the commits in the release by doing the following: 

    1. Add an ordered list of items prefixed with `Bug:`, `Feature:`, `Enhancement:`, `Documentation:`, etc.

    2. Include the issue number in the format `#51` (to auto link to issue/pull request 51) if it applies. 

    3. Add a brief description of the task that was completed.

  8. **(optional)** Add any known issues or potential breaking changes with this version.

10. **(optional)** Tweet and/or blog about the new release. Tell your buddies at the bar, whatever.

Then, start working on the next release... (rinse and repeat).