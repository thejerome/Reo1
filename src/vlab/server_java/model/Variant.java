package vlab.server_java.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

import static vlab.server_java.model.util.Util.shrink;

/**

 {
 tau_gamma_values: [
 [0, 0], [34, 7], [65, 25], [78, 39], [88, 45], [98, 56], [120, 61], [132, 74], [152, 88], [170, 95]
 ],
 tube_length: 20,
 needed_Q: 1.2,
 ro: 1.386
 };

 */
public class Variant {

    private final List<BigDecimal[]> tau_gamma_values;
    private final BigDecimal tube_length;
    private final BigDecimal needed_Q;
    private final BigDecimal ro;


    @JsonCreator
    public Variant(
            @JsonProperty("tau_gamma_values") List<BigDecimal[]> tau_gamma_values,
            @JsonProperty("tube_length") BigDecimal tube_length,
            @JsonProperty("needed_Q") BigDecimal needed_Q,
            @JsonProperty("ro") BigDecimal ro) {

        Objects.requireNonNull(tau_gamma_values);
        Objects.requireNonNull(tube_length);
        Objects.requireNonNull(needed_Q);
        Objects.requireNonNull(ro);

        this.tau_gamma_values = shrink(tau_gamma_values);
        this.tube_length = shrink(tube_length);
        this.needed_Q = shrink(needed_Q);
        this.ro = ro;
    }

    public List<BigDecimal[]> getTau_gamma_values() {
        return tau_gamma_values;
    }

    public BigDecimal getTube_length() {
        return tube_length;
    }

    public BigDecimal getNeeded_Q() {
        return needed_Q;
    }

    public BigDecimal getRo() {
        return ro;
    }
}
