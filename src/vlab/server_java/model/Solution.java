package vlab.server_java.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import vlab.server_java.model.util.Util;

import java.math.BigDecimal;

import static vlab.server_java.model.util.Util.shrink;

/**
 *  {mu_values: [0, 1, 2, 1, 3], mu: 1.33, delta_p: 300, tube_radius: 0.03}
 */
public class Solution {

    private final BigDecimal mu;
    private final BigDecimal delta_p;
    private final BigDecimal tube_radius;

    @JsonCreator
    public Solution(
            @JsonProperty("mu") BigDecimal mu,
            @JsonProperty("delta_p") BigDecimal delta_p,
            @JsonProperty("tube_radius") BigDecimal tube_radius) {
        this.mu = shrink(mu);
        this.delta_p = shrink(delta_p);
        this.tube_radius = shrink(tube_radius);
    }

    public BigDecimal getMu() {
        return mu;
    }

    public BigDecimal getDelta_p() {
        return delta_p;
    }

    public BigDecimal getTube_radius() {
        return tube_radius;
    }
}
