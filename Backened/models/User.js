var mongoose = require("mongoose");
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            match: [/.+\@.+\..+/, "Please enter a valid email address"],
        },
        password: {
            type: String,
            required: true,  // Password is required
        },
        role: {
            type: String,
            enum: ["Customer", "admin"], // Role can be either Customer or admin
            default: "Customer", // Default role is Customer
        },
    },
    { timestamps: true }
);

// Password Hash middleware
userSchema.pre("save", function (next) {
    if (!this.isModified("password")) return next(); // Only hash if the password was modified
    var self = this; // Store reference to 'this'
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(self.password, salt, function (err, hash) {
            if (err) return next(err);
            self.password = hash;  // Save the hashed password to the database
            next();
        });
    });
});

// Match User entered password to Hashed password
userSchema.methods.matchPassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password); // Compare entered password to the stored hashed password
}

module.exports = mongoose.model("User", userSchema);
