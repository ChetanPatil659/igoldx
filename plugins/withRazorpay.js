const { withAndroidManifest } = require("@expo/config-plugins");

const withRazorpay = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;

    // Add Razorpay permissions
    const permissions = androidManifest.manifest.permission || [];
    permissions.push(
      { $: { "android:name": "android.permission.INTERNET" } },
      { $: { "android:name": "android.permission.ACCESS_NETWORK_STATE" } }
    );
    androidManifest.manifest.permission = permissions;

    return config;
  });
};

module.exports = withRazorpay;
