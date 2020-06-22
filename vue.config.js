module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    proxy:
      "http://ec2-15-236-123-137.eu-west-3.compute.amazonaws.com/api/v1/user/verifyotp",
  },
};
