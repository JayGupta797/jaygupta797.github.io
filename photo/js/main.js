class ColorWheel {
    constructor(data) {
        this.data = data;
        this.svg = d3.select("#color-wheel");
        this.width = 600;
        this.height = 600;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        this.maxRadius = 250;
        this.selectedCircle = null;
        this.dateFilter = null; // Will store the current date range filter
        
        this.initialize();
    }

    initialize() {
        this.svg
            .attr("viewBox", `0 0 ${this.width} ${this.height}`)
            .attr("preserveAspectRatio", "xMidYMid meet");
            
        this.drawBase();
        this.setupTooltip();
        // Flatten data so that each color becomes an individual point on the wheel
        this.prepareColorPoints();
        this.setupDateBrush();
        this.plotPoints();
        this.setupEventListeners();
    }

    drawBase() {
        // Draw outer border
        this.svg.append("circle")
            .attr("cx", this.centerX)
            .attr("cy", this.centerY)
            .attr("r", this.maxRadius)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 5);

        // Draw rings
        const numRings = 4;
        for (let i = 1; i <= numRings; i++) {
            this.svg.append("circle")
                .attr("cx", this.centerX)
                .attr("cy", this.centerY)
                .attr("r", (this.maxRadius * i) / numRings)
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", 1);
        }

        // Draw spokes
        const numSpokes = 8;
        for (let i = 0; i < numSpokes; i++) {
            const angle = (i * Math.PI) / 4;
            const x1 = this.centerX + 50 * Math.cos(angle);
            const y1 = this.centerY + 50 * Math.sin(angle);
            const x2 = this.centerX + this.maxRadius * Math.cos(angle);
            const y2 = this.centerY + this.maxRadius * Math.sin(angle);

            this.svg.append("line")
                .attr("x1", x1)
                .attr("y1", y1)
                .attr("x2", x2)
                .attr("y2", y2)
                .attr("stroke", "black")
                .attr("stroke-width", 1);
        }
    }

    setupTooltip() {
        this.tooltip = this.svg.append("g")
            .attr("class", "annotation")
            .style("visibility", "hidden");
        
        // Add background rectangle
        this.tooltip.append("rect")
            .attr("class", "tooltip-bg")
            .attr("fill", "white")
            .attr("rx", 4)
            .attr("ry", 4);
        
        // Add text element
        this.tooltip.append("text")
            .attr("text-anchor", "middle");
    }

    // New helper to flatten the user's data structure
    prepareColorPoints() {
        this.colorPoints = [];
        let idCounter = 0;
        // Expecting this.data to be an array of entries, each with a `colors` array
        this.data.forEach(entry => {
            (entry.colors || []).forEach(color => {
                this.colorPoints.push({
                    id: idCounter++, // Add unique ID for data join
                    hsv: color.hsv,
                    rgb: color.rgb,
                    title: entry.title,
                    image: entry.image,
                    description: entry.description,
                    date: entry.date // Add date to the point
                });
            });
        });
    }

    plotPoints() {
        const filteredPoints = this.getFilteredColorPoints();
        
        const circles = this.svg.selectAll(".circle")
            .data(filteredPoints, d => d.id)
            .enter()
            .append("circle")
            .attr("class", "circle")
            .attr("cx", (d) => {
                const angle = d.hsv.h * 2 * Math.PI;
                const radius = d.hsv.s * this.maxRadius;
                return this.centerX + radius * Math.cos(angle);
            })
            .attr("cy", (d) => {
                const angle = d.hsv.h * 2 * Math.PI;
                const radius = d.hsv.s * this.maxRadius;
                return this.centerY + radius * Math.sin(angle);
            })
            .attr("r", 7.5)
            .attr("fill", d => `rgb(${d.rgb.r}, ${d.rgb.g}, ${d.rgb.b})`)
            .attr("stroke", "black")
            .attr("stroke-width", 2);

        this.setupCircleInteractions(circles);
    }

    setupCircleInteractions(circles) {
        circles
            .on("mouseover", (event, d) => {
                const circle = event.currentTarget;
                if (circle !== this.selectedCircle) {
                    d3.select(circle)
                        .attr("stroke", "var(--accent-color)")
                        .attr("r", 9);
                }
            })
            .on("mouseout", (event, d) => {
                const circle = event.currentTarget;
                if (circle !== this.selectedCircle) {
                    d3.select(circle)
                        .attr("stroke", "black")
                        .attr("r", 7.5);
                }
            })
            .on("click", (event, d) => {
                const circle = event.currentTarget;
                
                // If clicking the same circle, deselect it
                if (circle === this.selectedCircle) {
                    this.deselectCurrentCircle();
                    return;
                }

                // Deselect previous circle
                if (this.selectedCircle) {
                    d3.select(this.selectedCircle)
                        .attr("stroke", "black")
                        .attr("r", 7.5);
                }

                // Select new circle
                this.selectedCircle = circle;
                d3.select(circle)
                    .attr("stroke", "var(--accent-color)")
                    .attr("r", 9);

                this.updateDisplay(d, circle);
            });
    }

    deselectCurrentCircle() {
        if (this.selectedCircle) {
            d3.select(this.selectedCircle)
                .attr("stroke", "black")
                .attr("r", 7.5);
            this.selectedCircle = null;
        }

        // Reset tooltip
        this.tooltip.style("visibility", "hidden");

        // Reset image container
        const img = document.getElementById("displayed-image");
        img.style.display = "none";
        img.style.opacity = "0";
        
        // Show placeholder
        const placeholder = document.querySelector('.image-placeholder');
        placeholder.style.opacity = '1';
        placeholder.innerHTML = `
            <span class="material-icons">travel_explore</span>
            <span class="placeholder-text">Select a location to view details</span>
        `;

        // Reset location details
        document.getElementById("location-details").innerHTML = `
            <p class="no-selection">Click any point on the color wheel to explore locations</p>
        `;

        // Reset location title in overlay
        document.querySelector('.location-title').textContent = '';
    }

    updateDisplay(data, circle) {
        // Update tooltip
        const x = parseFloat(circle.getAttribute("cx"));
        const y = parseFloat(circle.getAttribute("cy"));
        
        // Update the text first
        const tooltipText = this.tooltip.select("text")
            .text(data.title)
            .attr("x", x)
            .attr("y", y - 15);
        
        // Get text dimensions to size background
        const bbox = tooltipText.node().getBBox();
        
        // Update background rectangle
        this.tooltip.select("rect")
            .attr("x", bbox.x - 5)
            .attr("y", bbox.y - 3)
            .attr("width", bbox.width + 10)
            .attr("height", bbox.height + 6);
        
        // Make tooltip visible
        this.tooltip.style("visibility", "visible");
        // Ensure tooltip stays above circles
        this.tooltip.raise();
        
        // Update image with loading state
        const img = document.getElementById("displayed-image");
        const placeholder = document.querySelector('.image-placeholder');
        
        // Show placeholder while loading
        placeholder.style.opacity = '1';
        img.style.opacity = '0';
        
        img.onload = () => {
            placeholder.style.opacity = '0';
            img.style.opacity = '1';
        };

        img.onerror = () => {
            placeholder.style.opacity = '1';
            placeholder.innerHTML = `
                <span class="material-icons">broken_image</span>
                <span>Image failed to load</span>
            `;
        };

        img.src = data.image;
        img.style.display = "block";
        
        // Update location details
        this.updateLocationDetails(data);
    }

    updateLocationDetails(data) {
        const details = document.getElementById('location-details');
        details.innerHTML = `
            <div class="location-card">
                <h3>${data.title}</h3>
                <p>${data.description}</p>
                <div class="location-meta">
                    <span>HSV: ${Math.round(data.hsv.h * 360)}° and ${Math.round(data.hsv.s * 100)}%</span>
                </div>
            </div>
        `;

        document.querySelector('.location-title').textContent = data.title;
    }

    setupEventListeners() {
        // Hide tooltip on click elsewhere
        this.svg.on("click", (event) => {
            if (event.target.tagName !== "circle") {
                this.tooltip.style("visibility", "hidden");
                this.deselectCurrentCircle();
                return;
            }
        });

        // Add view toggle functionality
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                // Add view switching logic here if needed
            });
        });

        // Add info icon tooltip
        const infoIcon = document.querySelector('.info-icon');
        infoIcon.addEventListener('mouseover', () => {
            // Add tooltip logic
        });

        // Add reset button functionality
        const resetBtn = document.querySelector('.reset-btn');
        resetBtn.addEventListener('click', () => {
            this.resetDateFilter();
        });
    }

    // Parse date string to Date object
    parseDate(dateString) {
        // Format: "2025:05:07 16:18:11"
        const [datePart, timePart] = dateString.split(' ');
        const [year, month, day] = datePart.split(':');
        const [hour, minute, second] = timePart.split(':');
        return new Date(year, month - 1, day, hour, minute, second);
    }

    setupDateBrush() {
        // Parse all dates and get date range
        const dates = this.data.map(d => this.parseDate(d.date));
        const dateExtent = d3.extent(dates);
        
        // Set up brush dimensions - make it responsive
        const container = document.querySelector('.date-brush-container');
        const containerWidth = container.offsetWidth;

        // Account for container padding
        const containerStyle = window.getComputedStyle(container);
        const paddingLeft   = parseFloat(containerStyle.paddingLeft)  || 0;
        const paddingRight  = parseFloat(containerStyle.paddingRight) || 0;
        const cardContentWidth = containerWidth - paddingLeft - paddingRight;

        const margin = { top: 10, right: 10, bottom: 10, left: 10 };

        // Width of the drawable area (excluding outer margins)
        const brushWidth = cardContentWidth - margin.left - margin.right;
        const brushHeight = 60;
        
        // Create brush SVG sized to the card content width
        const brushSvg = d3.select("#date-brush")
            .attr("width", cardContentWidth)
            .attr("height", brushHeight + margin.top + margin.bottom);
            
        // Create scales
        this.xScale = d3.scaleTime()
            .domain(dateExtent)
            .range([margin.left, cardContentWidth - margin.right]);
            
        // Create brush
        this.brush = d3.brushX()
            .extent([[margin.left, margin.top], [cardContentWidth - margin.right, brushHeight - margin.top]])
            .on("brush end", (event) => this.onBrush(event));
            
        // Add brush to SVG
        const brushGroup = brushSvg.append("g")
            .attr("class", "brush")
            .call(this.brush);
            
        // Add x-axis with responsive tick count
        const tickCount = cardContentWidth < 400 ? 4 : 6;
        const xAxis = d3.axisBottom(this.xScale)
            .tickFormat(d3.timeFormat("%b %d"))
            .ticks(tickCount);
            
        const axisGroup = brushSvg.append("g")
            .attr("class", "axis")
            .attr("transform", `translate(0, ${brushHeight - margin.top})`)
            .call(xAxis);
        
        // Ensure axis is on top of brush elements
        axisGroup.raise();
            
        // Initialize date info
        this.updateDateInfo();
        
        // Add resize listener for responsiveness (only once)
        if (!this.resizeListenerAdded) {
            this.resizeListenerAdded = true;
            window.addEventListener('resize', () => {
                this.resizeBrush();
            });
        }
    }

    resizeBrush() {
        // Debounce resize to avoid excessive calls
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            // Store current filter
            const currentFilter = this.dateFilter;
            
            // Remove existing brush and recreate
            d3.select("#date-brush").selectAll("*").remove();
            this.setupDateBrush();
            
            // Restore filter if it exists
            if (currentFilter) {
                const [startDate, endDate] = currentFilter;
                const x0 = this.xScale(startDate);
                const x1 = this.xScale(endDate);
                d3.select(".brush").call(this.brush.move, [x0, x1]);
                this.dateFilter = currentFilter; // Restore the filter
            }
        }, 250);
    }

    onBrush(event) {
        const selection = event.selection;
        
        if (selection === null) {
            // No selection, show all points
            this.dateFilter = null;
        } else {
            // Convert pixel coordinates to dates
            const [x0, x1] = selection;
            const startDate = this.xScale.invert(x0);
            const endDate = this.xScale.invert(x1);
            this.dateFilter = [startDate, endDate];
        }
        
        this.updateVisualization();
        this.updateDateInfo();
    }

    updateVisualization() {
        // Filter color points based on date range
        const filteredPoints = this.getFilteredColorPoints();
        
        // Update circles
        const circles = this.svg.selectAll(".circle")
            .data(filteredPoints, d => d.id);
            
        // Remove circles that are no longer in the filtered data
        circles.exit().remove();
        
        // Add new circles
        const newCircles = circles.enter()
            .append("circle")
            .attr("class", "circle")
            .attr("r", 7.5)
            .attr("stroke", "black")
            .attr("stroke-width", 2);
            
        // Update all circles (existing + new)
        circles.merge(newCircles)
            .attr("cx", (d) => {
                const angle = d.hsv.h * 2 * Math.PI;
                const radius = d.hsv.s * this.maxRadius;
                return this.centerX + radius * Math.cos(angle);
            })
            .attr("cy", (d) => {
                const angle = d.hsv.h * 2 * Math.PI;
                const radius = d.hsv.s * this.maxRadius;
                return this.centerY + radius * Math.sin(angle);
            })
            .attr("fill", d => `rgb(${d.rgb.r}, ${d.rgb.g}, ${d.rgb.b})`);
            
        // Reset interactions
        this.setupCircleInteractions(circles.merge(newCircles));
        
        // Clear selection if current selection is not in filtered data
        if (this.selectedCircle && !filteredPoints.find(p => p.id === d3.select(this.selectedCircle).datum().id)) {
            this.deselectCurrentCircle();
        }
    }

    getFilteredColorPoints() {
        if (!this.dateFilter) {
            return this.colorPoints;
        }
        
        const [startDate, endDate] = this.dateFilter;
        return this.colorPoints.filter(point => {
            const pointDate = this.parseDate(point.date);
            return pointDate >= startDate && pointDate <= endDate;
        });
    }

    updateDateInfo() {
        const filteredPoints = this.getFilteredColorPoints();
        const totalPoints = this.colorPoints.length;
        
        // Update point count
        document.querySelector('.point-count').textContent = 
            `${filteredPoints.length} of ${totalPoints} points`;
            
        // Update date range
        const dateRangeEl = document.querySelector('.date-range');
        if (this.dateFilter) {
            const [startDate, endDate] = this.dateFilter;
            const formatDate = d3.timeFormat("%b %d, %Y");
            dateRangeEl.textContent = `${formatDate(startDate)} - ${formatDate(endDate)}`;
        } else {
            const dates = this.data.map(d => this.parseDate(d.date));
            const dateExtent = d3.extent(dates);
            const formatDate = d3.timeFormat("%b %d, %Y");
            dateRangeEl.textContent = `${formatDate(dateExtent[0])} - ${formatDate(dateExtent[1])}`;
        }
    }

    resetDateFilter() {
        this.dateFilter = null;
        d3.select(".brush").call(this.brush.move, null);
        this.updateVisualization();
        this.updateDateInfo();
    }
}

// Initialize the visualization when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const wheel = new ColorWheel(DATA);
}); 