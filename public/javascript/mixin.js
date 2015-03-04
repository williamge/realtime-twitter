"use strict";

/**
 * Will prime an object's prototype to have mixins applied to it, and will apply any supplied mixins in parameter 'mixins' to the object.
 * @param mixins Array of mixins to apply to function
 */
module.exports = function mixin(...mixins) {

    if (this === null || this == undefined) {
        throw new TypeError("Mixin needs to be called on an object to apply a mixin to it.");
    }

    this.prototype._mixinCtors = this.prototype._mixinCtors || [];

    /**
     * To be called in the object's constructor, will call constructors on applied mixins and set up any necessary state.
     * @private
     */
    this.prototype._applyMixins = function () {

        /**
         * Object for mixins to use for state
         * @type {{}|*}
         * @private
         */
        this._mixinState = this._mixinState || {};

        //calls constructor for each mixins on the new object
        this._mixinCtors.forEach((f) => {
            f.call(this)
        });
    };

    //applies supplied mixins
    mixins.forEach((m) => {
        m(this);
    });

};