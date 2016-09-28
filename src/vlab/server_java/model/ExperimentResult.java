package vlab.server_java.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

import static vlab.server_java.model.util.Util.shrink;

/**
 * default_calculate_data = {Q: 1.386}
 */
public class ExperimentResult {

    private final BigDecimal q;

    @JsonCreator
    public ExperimentResult(
            @JsonProperty("Q") BigDecimal q ) {
        this.q = shrink(q);
    }

    @JsonProperty("Q")
    public BigDecimal getQ() {
        return q;
    }
}
