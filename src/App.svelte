<script lang="ts">
    import EditableSim from "./EditableSim.svelte";
    import HideUntilVisible from "./HideUntilVisible.svelte";
</script>

<style>
    footer {
      padding-bottom: 16px;
    }
</style>

<h1>Does the Supreme Court need to have a fixed size?</h1>
<h3><i>A simulation by David Leppik</i></h3>

<p>
    The members of the United States Supreme Court are chosen using a macabre lottery in which death or retirement determines whether or not a president can appoint a member. This is because the US Constitution specifies lifetime appointments and Congress has chosen to fix the size of the court. The exact size has changed over time, but it is currently set at nine members.
</p>
<p>
    Changing the size of the court to any other fixed number changes the frequency of this lottery, but not its character. Within the limits of the Constitution, they only fair mechanism is to add justices at a fixed rate without regard to the court’s size. Adding one justice each presidential term gives voters, rather than chance or subterfuge, indirect control over the composition of the court.
</p>
<p>
    Even if we could amend the Constitution to add term limits, that might not be wise. Judicial wisdom doers not peak at a particular age, and justices are often still improving when death or poor health force them to retire. Generational diversity is therefore best accomplished by keeping justices active as long as possible.
</p>
<p>
    There is no perfect size for the court. Some people prefer odd numbers to force a majority in every decision, but a tie vote (meaning the lower court's ruling stands) isn't an unreasonable outcome when the court is divided.
</p>
<p>
    Different sizes have different advantages.
    Size promotes diversity of thought, but if it is too large, a meaningful discussion becomes difficult. When I went to college, 16 was considered the ideal class size for discussions. My church has nine member Board of Trustees, based on the theory that larger boards encourage people to be wallflowers. Regardless, there is no single exact size that has proven ideal for decision making.
</p>

<HideUntilVisible>
    <EditableSim />
</HideUntilVisible>

<footer>
    <hr>
    <p>
        Copyright © 2021 by David Leppik. Shared under the <a href="https://www.apache.org/licenses/LICENSE-2.0">Apache License</a>,
        meaning it can be used elsewhere, including in for-profit works, so long as proper attribution is made.
        <a href="https://github.com/dleppik/scotus">Git the source!</a>
    </p>
<p><i>Programmed using <a href="https://svelte.dev">Svelte</a>. </i></p>
</footer>
